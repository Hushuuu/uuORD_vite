import { ORDI18n } from '../i18n.js';
import appShared from '../shared/app-shared.js';
import { createSkillDialog, SKILL_ICON } from '../shared/skill-description.js';
import historiesUrl from '../../data/ord-clear-histories.json?url';

const { TMO_TRANSFER_DATA, escapeHtml, getDisplayName, getLevelLabel } = appShared;
const pageSize = 20;
const routes = new Map([
  ['연합세력', 'routes.alliance'],
  ['패왕의길', 'routes.conqueror'],
  ['도박광', 'routes.gambler'],
  ['최고의도움', 'routes.support'],
]);
const nodes = new Map([
  ['일석이조', 'alliance.double_reward'],
  ['긴급소집', 'alliance.emergency'],
  ['특성공학', 'alliance.trait_engineering'],
  ['바운티헌터', 'conqueror.bounty_hunter'],
  ['로얄로더', 'conqueror.royal_road'],
  ['계엄령', 'conqueror.martial_law'],
  ['카지노', 'gambler.casino'],
  ['리스크헷지', 'gambler.risk_hedge'],
  ['환전소', 'gambler.exchange'],
  ['역발상', 'support.reverse_thinking'],
  ['최대출력', 'support.max_output'],
  ['연금술', 'support.alchemy'],
]);

function translate(field, values) {
  return ORDI18n.t(`page.clear_histories.${field}`, values);
}

function getLabel(key, fallback) {
  if (!fallback) return '—';
  if (!key) return fallback;
  const label = ORDI18n.t(key);
  return label === key ? fallback : label;
}

function getHistoryLabel(field, value) {
  const key = typeof value === 'string' && /^[가-힣]+$/.test(value)
    ? `page.clear_histories.${field}.${value}`
    : null;
  return getLabel(key, value);
}

function getNavigationLabel(labels, value) {
  const key = labels.get(value);
  return getLabel(key && `page.navigation.${key}`, value);
}

function renderUnit(unit, characters) {
  const character = characters.get(TMO_TRANSFER_DATA.get(unit.code));
  const name = (character && getDisplayName(character)) || unit.name || unit.code;
  const count = unit.count > 1 ? `<span class="clear-unit-count">×${escapeHtml(unit.count)}</span>` : '';
  const badge = character ? `
    <span class="badge badge-${escapeHtml(character.level)}">${escapeHtml(getLevelLabel(character.level))}</span>
  ` : '';
  const skillLabel = translate('skills_for', { name });

  return `
    <span class="clear-unit">
      ${badge}
      <span class="char-card-name clear-unit-name" title="${escapeHtml(name)}">${escapeHtml(name)}</span>
      ${count}
      <button type="button" class="clear-skill-button" data-view-skills="${escapeHtml(character?.character_id)}"
        data-unit-name="${escapeHtml(name)}" title="${escapeHtml(skillLabel)}"
        aria-label="${escapeHtml(skillLabel)}" aria-haspopup="dialog">
        ${SKILL_ICON}
      </button>
    </span>
  `;
}

function renderHistory(history, characters, dateFormatter, metadataId) {
  const units = history.units.length
    ? history.units.map((unit) => renderUnit(unit, characters)).join('')
    : `<span class="clear-muted">${escapeHtml(translate('no_units'))}</span>`;
  const fields = [
    ['elder', getHistoryLabel('elders', history.elder)],
    ['final_unit_count', history.finalUnitCount ?? '—'],
    ['navigation', getNavigationLabel(routes, history.navigation)],
    ['node', getNavigationLabel(nodes, history.node)],
  ];
  const metadata = fields.map(([key, value]) => `
    <div>
      <dt>${escapeHtml(translate(key))}</dt>
      <dd>${escapeHtml(value)}</dd>
    </div>
  `).join('');

  return `
    <article class="clear-history">
      <button type="button" class="clear-history-heading" aria-expanded="false" aria-controls="${metadataId}">
        <span class="clear-history-player">${escapeHtml(history.playerName || '—')}</span>
        <time datetime="${escapeHtml(history.createdAt)}" title="UTC+08:00">
          ${escapeHtml(dateFormatter.format(new Date(history.createdAt)))}
        </time>
        <span class="clear-history-action">${escapeHtml(translate('details'))}</span>
      </button>
      <div class="clear-units">${units}</div>
      <dl id="${metadataId}" class="clear-history-metadata" hidden>${metadata}</dl>
    </article>
  `;
}

function renderDifficultyPanel(panel, runs, characters, dateFormatter) {
  panel.innerHTML = `
    <p class="clear-group-count">${escapeHtml(translate('count', { count: runs.length }))}</p>
    <div class="clear-history-list"></div>
    <button type="button" class="clear-load-more">${escapeHtml(translate('more'))}</button>
  `;
  const list = panel.querySelector('.clear-history-list');
  const button = panel.querySelector('.clear-load-more');
  let nextIndex = 0;

  function appendRuns() {
    const batch = runs.slice(nextIndex, nextIndex + pageSize);
    const markup = batch.map((history, index) => (
      renderHistory(history, characters, dateFormatter, `${panel.id}-run-${nextIndex + index}`)
    ));
    list.insertAdjacentHTML('beforeend', markup.join(''));
    nextIndex += batch.length;
    button.hidden = nextIndex >= runs.length;
  }

  appendRuns();
  button.addEventListener('click', () => {
    const previousRun = list.lastElementChild;
    appendRuns();
    previousRun.nextElementSibling?.querySelector('.clear-history-heading').focus();
  });
}

function renderGroups(container, histories, characters) {
  const dateFormatter = new Intl.DateTimeFormat(ORDI18n.getLang() === 'zh' ? 'zh-TW' : 'en', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Asia/Taipei',
  });
  const groups = new Map();
  histories.sort((left, right) => Date.parse(right.createdAt) - Date.parse(left.createdAt));
  for (const history of histories) {
    if (!groups.has(history.difficulty)) groups.set(history.difficulty, []);
    groups.get(history.difficulty).push(history);
  }

  const tablist = document.createElement('div');
  tablist.className = 'clear-difficulty-tabs';
  tablist.setAttribute('role', 'tablist');
  tablist.setAttribute('aria-label', translate('difficulty'));
  container.append(tablist);

  const tabs = [...groups].map(([difficulty, runs], index) => {
    const label = getHistoryLabel('difficulties', difficulty);
    const tab = document.createElement('button');
    const panel = document.createElement('section');
    tab.type = 'button';
    tab.id = `clear-difficulty-tab-${index}`;
    tab.textContent = label;
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-controls', `clear-difficulty-panel-${index}`);
    panel.id = `clear-difficulty-panel-${index}`;
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', tab.id);
    panel.tabIndex = 0;
    tablist.append(tab);
    container.append(panel);
    return { tab, panel, runs };
  });

  function selectTab(index, focusTab = false) {
    tabs.forEach(({ tab, panel }, tabIndex) => {
      const selected = index === tabIndex;
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
      panel.hidden = !selected;
    });
    const { tab, panel, runs } = tabs[index];
    if (!panel.firstElementChild) renderDifficultyPanel(panel, runs, characters, dateFormatter);
    if (focusTab) tab.focus();
  }

  tabs.forEach(({ tab }, index) => {
    tab.addEventListener('click', () => selectTab(index));
    tab.addEventListener('keydown', (event) => {
      const targets = {
        ArrowLeft: (index - 1 + tabs.length) % tabs.length,
        ArrowRight: (index + 1) % tabs.length,
        Home: 0,
        End: tabs.length - 1,
      };
      if (!Object.hasOwn(targets, event.key)) return;
      event.preventDefault();
      selectTab(targets[event.key], true);
    });
  });
  selectTab(0);
}

export default async function initClearHistoriesPage(records) {
  const status = document.getElementById('clearHistoryStatus');
  const container = document.getElementById('clearHistoryGroups');
  const characters = new Map(records.map((record) => [record.character_id, record]));
  const openSkills = createSkillDialog();

  container.addEventListener('click', (event) => {
    const skill = event.target.closest('[data-view-skills]');
    if (skill) {
      const record = characters.get(skill.dataset.viewSkills);
      openSkills(record, skill.dataset.unitName, ORDI18n.getLang() === 'en');
      return;
    }

    const heading = event.target.closest('.clear-history-heading');
    if (heading) {
      const metadata = document.getElementById(heading.getAttribute('aria-controls'));
      heading.setAttribute('aria-expanded', String(metadata.hidden));
      metadata.hidden = !metadata.hidden;
    }
  });

  try {
    const response = await fetch(historiesUrl);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const histories = await response.json();
    if (!Array.isArray(histories)) throw new Error('Expected an array of clear histories.');

    if (histories.length) {
      renderGroups(container, histories, characters);
      status.hidden = true;
    } else {
      status.textContent = translate('empty');
    }
  } catch (error) {
    status.textContent = translate('load_error');
    console.error('Failed to load clear histories:', error);
  }
}
