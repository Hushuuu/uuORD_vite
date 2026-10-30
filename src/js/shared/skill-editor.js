import { SKILL_MARKS, escapeSkillText as esc, getSkills, renderSkills } from './skill-description.js';

export function createSkillEditor(host) {
  let draft = [];
  function render() {
    host.innerHTML = draft.map((skill, index) => `<section class="skill-editor-card" data-skill-index="${index}">
      <div class="inline-actions">
        <strong>技能 ${index + 1}</strong>
        <button type="button" data-skill-action="up" ${index === 0 ? 'disabled' : ''} aria-label="上移技能">↑</button>
        <button type="button" data-skill-action="down" ${index === draft.length - 1 ? 'disabled' : ''} aria-label="下移技能">↓</button>
        <button type="button" class="danger" data-skill-action="remove">刪除技能</button>
      </div>
      <label class="field-group">技能名稱<input class="field-input" data-skill-field="name" value="${esc(skill.name)}"></label>
      <label class="field-group">發動方式<select class="field-select" data-skill-field="type">
        ${[['', '未分類'], ['active', '主動'], ['passive', '被動']].map(([value, label]) => `<option value="${value}" ${skill.type === value ? 'selected' : ''}>${label}</option>`).join('')}
      </select></label>
      <label class="field-group">簡述<textarea class="field-textarea" data-skill-field="summary">${esc(skill.summary)}</textarea></label>
      <label class="field-group">詳細說明（可留空）<textarea class="field-textarea" data-skill-field="description">${esc(skill.description)}</textarea></label>
      <p class="muted">先選取簡述或詳細說明中的文字，再按下標色按鈕。</p>
      <div class="inline-actions">${Object.entries(SKILL_MARKS).map(([key, label]) => `<button type="button" class="secondary" data-skill-mark="${key}"><span class="skill-mark-${key}">${label}</span></button>`).join('')}</div>
      <div class="skill-live-preview" aria-label="技能即時預覽">${renderSkills([skill])}</div>
    </section>`).join('') || '<p class="muted">尚未新增技能，可先填簡述，之後再補詳細說明。</p>';
  }
  host.addEventListener('input', (event) => {
    const field = event.target.dataset.skillField;
    const card = event.target.closest('[data-skill-index]');
    if (!field || !card) return;
    draft[Number(card.dataset.skillIndex)][field] = event.target.value;
    card.querySelector('.skill-live-preview').innerHTML = renderSkills([draft[Number(card.dataset.skillIndex)]]);
  });
  let activeText = null;
  host.addEventListener('focusin', (event) => {
    if (event.target.matches('textarea[data-skill-field]')) activeText = event.target;
  });
  host.addEventListener('click', (event) => {
    const button = event.target.closest('button');
    const card = button?.closest('[data-skill-index]');
    if (!card) return;
    const index = Number(card.dataset.skillIndex);
    if (button.dataset.skillMark) {
      const input = activeText && card.contains(activeText) ? activeText : card.querySelector('[data-skill-field="description"]');
      const start = input.selectionStart;
      const end = input.selectionEnd;
      const text = input.value.slice(start, end) || '重點文字';
      const mark = button.dataset.skillMark;
      input.setRangeText(`{${mark}|${text}}`, start, end, 'select');
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.focus();
      return;
    }
    const action = button.dataset.skillAction;
    if (action === 'remove') draft.splice(index, 1);
    if (action === 'up' && index > 0) [draft[index - 1], draft[index]] = [draft[index], draft[index - 1]];
    if (action === 'down' && index < draft.length - 1) [draft[index + 1], draft[index]] = [draft[index], draft[index + 1]];
    activeText = null;
    render();
  });
  return {
    load(record) { draft = structuredClone(getSkills(record)); activeText = null; render(); },
    add() { draft.push({ id: `skill-${crypto.randomUUID()}`, name: '', type: '', summary: '', description: '' }); render(); host.lastElementChild.querySelector('input').focus(); },
    read() { return structuredClone(draft); }
  };
}
