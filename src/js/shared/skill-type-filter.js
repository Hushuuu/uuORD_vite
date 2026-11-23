import { ORDI18n } from '../i18n.js';
import { escapeHtml, renderSkillTypeOptions } from './data-index-utils.js';

export function createSkillTypeFilter(container, selectedTypes, onChange) {
  const groups = ORDI18n.getSkillTypeGroups();
  const id = escapeHtml(container.id);
  container.innerHTML = `
    <div class="skill-filter-categories">
      ${groups.map(({ label }, index) => `
        <button class="skill-filter-category" id="${id}-category-${index}" type="button"
          aria-expanded="false" aria-controls="${id}-options-${index}">
          ${escapeHtml(label)}<span class="skill-filter-count"></span>
          <span class="skill-filter-arrow" aria-hidden="true"></span>
        </button>
      `).join('')}
    </div>
    ${groups.map(({ options }, index) => `
      <div class="skill-filter-options" id="${id}-options-${index}" role="group"
        aria-labelledby="${id}-category-${index}" hidden>
        <div class="checkbox-badge-grid">${renderSkillTypeOptions(options, selectedTypes)}</div>
      </div>
    `).join('')}
    <div class="skill-filter-selection" hidden>
      <span class="skill-filter-selection-count" aria-live="polite"></span>
      <div class="skill-filter-chips"></div>
    </div>
  `;

  const buttons = [...container.querySelectorAll('.skill-filter-category')];
  const panels = [...container.querySelectorAll('.skill-filter-options')];
  const inputs = [...container.querySelectorAll('input[type="checkbox"]')];
  const inputsByType = new Map(inputs.map((input) => [input.value, input]));
  const selection = container.querySelector('.skill-filter-selection');
  const selectionCount = container.querySelector('.skill-filter-selection-count');
  const chips = container.querySelector('.skill-filter-chips');
  let activeGroup = -1;

  function showGroup(index) {
    activeGroup = index;
    buttons.forEach((button, groupIndex) => {
      const isOpen = groupIndex === activeGroup;
      button.setAttribute('aria-expanded', String(isOpen));
      panels[groupIndex].hidden = !isOpen;
    });
  }

  function renderSelection() {
    groups.forEach(({ options }, index) => {
      const count = options.filter(({ value }) => selectedTypes.has(value)).length;
      buttons[index].querySelector('.skill-filter-count').textContent = count ? `(${count})` : '';
    });

    selection.hidden = selectedTypes.size === 0;
    selectionCount.textContent = ORDI18n.t('skill_filter.selected', { count: selectedTypes.size });
    chips.innerHTML = [...selectedTypes].map((value) => {
      const label = ORDI18n.getSkillTypeLabel(value);
      const removeLabel = ORDI18n.t('skill_filter.remove', { label });
      return `
        <button class="skill-filter-chip" type="button" data-skill-type="${escapeHtml(value)}"
          aria-label="${escapeHtml(removeLabel)}">
          ${escapeHtml(label)} <span aria-hidden="true">×</span>
        </button>
      `;
    }).join('');
  }

  buttons.forEach((button, index) => {
    button.addEventListener('click', () => showGroup(activeGroup === index ? -1 : index));
  });

  inputs.forEach((input) => {
    input.addEventListener('change', () => {
      if (input.checked) {
        selectedTypes.add(input.value);
      } else {
        selectedTypes.delete(input.value);
      }
      renderSelection();
      onChange();
    });
  });

  chips.addEventListener('click', (event) => {
    const chip = event.target.closest('button[data-skill-type]');
    if (!chip) {
      return;
    }

    const { skillType } = chip.dataset;
    const index = [...chips.children].indexOf(chip);
    const groupIndex = groups.findIndex(({ options }) => options.some(({ value }) => value === skillType));
    selectedTypes.delete(skillType);
    inputsByType.get(skillType).checked = false;
    renderSelection();

    const nextFocus = chips.children[index] || chips.lastElementChild || buttons[groupIndex];
    nextFocus.focus();
    onChange();
  });

  renderSelection();

  return {
    reset() {
      selectedTypes.clear();
      inputs.forEach((input) => {
        input.checked = false;
      });
      showGroup(-1);
      renderSelection();
    }
  };
}
