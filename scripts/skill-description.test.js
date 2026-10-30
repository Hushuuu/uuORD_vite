import test from 'node:test';
import assert from 'node:assert/strict';
import { SKILL_MARKS, getSkills, renderSkillText, renderSkills } from '../src/js/shared/skill-description.js';

test('只解析允許的語意標記，保留換行與未知標記', () => {
  for (const key of Object.keys(SKILL_MARKS)) {
    assert.equal(renderSkillText(`{${key}|效果}`), `<span class="skill-mark-${key}">效果</span>`);
  }
  assert.equal(renderSkillText('第一行\n{unknown|文字}'), '第一行\n{unknown|文字}');
});

test('說明、標色內容與技能名稱中的 HTML 都會跳脫', () => {
  const attack = '<img src=x onerror="alert(1)">';
  assert.ok(!renderSkillText(attack).includes('<img'));
  assert.ok(!renderSkillText(`{important|${attack}}`).includes('<img'));
  const html = renderSkills([{ name: attack, type: attack, summary: attack, description: attack }]);
  assert.ok(!html.includes('<img'));
  assert.ok(html.includes('&lt;img'));
});

test('相容舊資料、簡述技能與可展開的詳細說明', () => {
  assert.deepEqual(getSkills({}), []);
  assert.deepEqual(getSkills({ skills: null }), []);
  assert.deepEqual(getSkills({ skills: [null, 'bad'] }), []);
  assert.ok(!renderSkills([{ name: '簡易', summary: '簡述' }]).includes('<details>'));
  assert.ok(renderSkills([{ name: '完整', description: '內容' }]).includes('<details>'));
  assert.ok(renderSkills([]).includes('尚未補上'));
});
