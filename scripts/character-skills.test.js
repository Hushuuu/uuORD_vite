import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import records from '../src/js/ord_data.js';
import { EXCLUDED_IDS, parseResearchDocument, highlightSkillText } from './import-researched-skills.js';
import { SKILL_MARKS, renderSkills } from '../src/js/shared/skill-description.js';

const publicRecords = JSON.parse(readFileSync(new URL('../public/ord_data_export.json', import.meta.url), 'utf8'));
const byId = new Map(records.map((record) => [record.character_id, record]));
const text = (skill) => skill.description.replace(/\{[a-z]+\|([^{}]*)\}/g, '$1');

test('底稿拆開同一行技能，不把摘要與缺資料註記匯入', () => {
  const doc = '### 4-22｜範例\n\n- **摘要**：略過\n- **單體控制**：攻擊 35%。**追擊**：攻擊 12.5%。\n- **資料限制**：略過\n\n### 4-23｜缺資料\n- **未登錄技能資料**：略過\n';
  const parsed = parseResearchDocument(doc);
  assert.deepEqual(parsed.get('4-22').entries.map((entry) => entry.name), ['單體控制', '追擊']);
  assert.deepEqual(parsed.get('4-23').entries, []);
});

test('標色保留原文並且不產生巢狀或未知標記', () => {
  const plain = '攻擊 12.5%，20 萬物理傷害、暈眩 2 秒；攻速 +35%，冷卻 10 秒。';
  const colored = highlightSkillText(plain);
  assert.equal(colored.replace(/\{[a-z]+\|([^{}]*)\}/g, '$1'), plain);
  assert.ok(colored.includes('{chance|攻擊 12.5%}'));
  assert.ok(colored.includes('{physical|物理傷害}'));
  assert.ok(colored.includes('{control|暈眩 2 秒}'));
});

test('所有技能可安全渲染，ID 唯一且前後台技能內容一致', () => {
  const ids = new Set();
  const publicById = new Map(publicRecords.map((record) => [record.character_id, record]));
  for (const record of records) {
    assert.deepEqual(record.skills, publicById.get(record.character_id)?.skills, record.character_id);
    for (const skill of record.skills || []) {
      assert.ok(!ids.has(skill.id), `重複技能 ID：${skill.id}`);
      ids.add(skill.id);
      assert.ok(skill.name.trim());
      assert.ok(skill.summary.trim());
      assert.ok(skill.description.trim());
      assert.ok(['', 'active', 'passive'].includes(skill.type));
      assert.ok(!/來源|底稿|網站|匯入|【整理名】|\*\*|`/.test(skill.description));
      const matches = [...skill.description.matchAll(/\{([a-z]+)\|([^{}]*)\}/g)];
      for (const match of matches) assert.ok(Object.hasOwn(SKILL_MARKS, match[1]));
      assert.ok(!skill.description.replace(/\{[a-z]+\|([^{}]*)\}/g, '$1').match(/[{}]/));
    }
    const html = renderSkills(record.skills || []);
    assert.ok(!/undefined|\{(?:physical|magic|control|buff|chance|important)\|/.test(html));
  }
  assert.ok(ids.size > 500, '確認整批角色技能已匯入');
});

test('略過指定角色、素材與未登錄技能；保留有資料的支援效果', () => {
  for (const id of [...EXCLUDED_IDS, '1-1', '2-12', '4-7', '4-46']) assert.equal(byId.get(id).skills, undefined, id);
  assert.equal(byId.get('3-1').skills[0].name, '緩速支援');
  assert.ok(text(byId.get('3-1').skills[0]).includes('5%'));
  assert.equal(byId.get('4-22').skills.length, 2);
  assert.ok(byId.get('9-10').skills.some((skill) => skill.name === '鳳凰印'));
});

test('共用頁以獨立 ID 匯入，條件強化獨立於基本技能', () => {
  const comparable = (id) => byId.get(id).skills.map(({ id: skillId, ...skill }) => skill);
  for (const id of ['10-3', '10-4', '10-6']) assert.deepEqual(comparable(id), comparable('10-2'));
  assert.deepEqual(comparable('12-1'), comparable('12-2'));
  assert.ok(byId.get('10-8').skills.some((skill) => skill.name === '天賦強化'));
  assert.ok(text(byId.get('10-8').skills.find((skill) => skill.name === '常駐')).includes('降防 30'));
  assert.ok(!byId.get('5-8').skills.some((skill) => /同上/.test(skill.description)));
});
