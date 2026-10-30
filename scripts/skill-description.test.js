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

test('直接呈現詳細說明，只有簡述的舊資料仍可顯示', () => {
  assert.deepEqual(getSkills({}), []);
  assert.deepEqual(getSkills({ skills: null }), []);
  assert.deepEqual(getSkills({ skills: [null, 'bad'] }), []);
  assert.ok(renderSkills([{ name: '簡易', summary: '舊簡述' }]).includes('舊簡述'));
  const html = renderSkills([{ name: '完整', summary: '不應顯示的簡述', description: '{magic|詳細內容}' }]);
  assert.ok(html.includes('<span class="skill-mark-magic">詳細內容</span>'));
  assert.ok(!html.includes('不應顯示的簡述'));
  assert.ok(!html.includes('<details>'));
  assert.ok(renderSkills([]).includes('尚未補上'));
});
