// 僅接受固定語意標記；資料中的 HTML 一律視為文字。
export const SKILL_MARKS = {
  physical: '物理', magic: '魔法', control: '控制',
  buff: '增益', chance: '機率', important: '重要'
};

export const SKILL_ICON = `
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor"
    stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
    <path d="M12 6c-3-2-6-2-9-1v14c3-1 6-1 9 1 3-2 6-2 9-1V5c-3-1-6-1-9 1Z"/>
    <path d="M12 6v14M6 9h3M6 12h3M15 9h3M15 12h3"/>
  </svg>
`;

export function escapeSkillText(value) {
  return String(value ?? '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[char]);
}

export function renderSkillText(value) {
  return String(value ?? '').split(/(\{[^{}]*\})/g).map((part) => {
    const match = /^\{([a-z]+)\|([^{}]*)\}$/.exec(part);
    return match && Object.hasOwn(SKILL_MARKS, match[1])
      ? `<span class="skill-mark-${match[1]}">${escapeSkillText(match[2])}</span>`
      : escapeSkillText(part);
  }).join('');
}

export function getSkills(record) {
  return Array.isArray(record?.skills) ? record.skills.filter((skill) => skill && typeof skill === 'object') : [];
}

export function renderSkills(skills, english = false) {
  if (!skills.length) return `<p class="muted">${english ? 'Skill descriptions have not been added yet.' : '尚未補上技能說明。'}</p>`;
  const types = english ? { active: 'Active', passive: 'Passive' } : { active: '主動', passive: '被動' };
  return skills.map((skill) => `<article class="skill-card">
    <h3>${escapeSkillText(skill.name || (english ? 'Unnamed skill' : '未命名技能'))}${types[skill.type] ? ` <small class="muted">${types[skill.type]}</small>` : ''}</h3>
    ${skill.description || skill.summary ? `<div class="skill-rich-text">${renderSkillText(skill.description || skill.summary)}</div>` : ''}
  </article>`).join('');
}

export function createSkillDialog() {
  const dialog = document.createElement('dialog');
  dialog.className = 'skill-dialog';
  dialog.setAttribute('aria-labelledby', 'skillDialogTitle');
  document.body.append(dialog);
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog || event.target.closest('[data-close-skills]')) dialog.close();
  });
  return (record, name, english = false) => {
    dialog.innerHTML = `<button type="button" class="secondary" data-close-skills>${english ? 'Close' : '關閉'}</button>
      <h2 id="skillDialogTitle">${escapeSkillText(name)} — ${english ? 'Skills' : '技能說明'}</h2>
      ${renderSkills(getSkills(record), english)}`;
    dialog.showModal();
  };
}
