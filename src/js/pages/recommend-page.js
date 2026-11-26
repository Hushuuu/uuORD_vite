import appShared from './../shared/app-shared.js';
import { ORDI18n } from './../i18n.js';
import { createSkillDialog } from '../shared/skill-description.js';
import { createSkillTypeFilter } from '../shared/skill-type-filter.js';
import {
  formatSkillLabelsWithValues as formatSkillLabelsWithValuesUtil,
  buildTargetLevelOptions as buildTargetLevelOptionsUtil,
  countMapTotal as countMapTotalUtil,
  normalizeOwnedValues as normalizeOwnedValuesUtil,
  createInventoryMap as createInventoryMapUtil,
  formatRequiredBaseMaterialsFromCounts as formatRequiredBaseMaterialsFromCountsUtil,
  formatExcessMaterialsFromCounts as formatExcessMaterialsFromCountsUtil,
  createRecipeAnalyzer,
  compareMissingTierCounts as compareMissingTierCountsUtil,
} from './recommend-algorithm.js';
import {
  renderMaterialPreview as renderMaterialPreviewUtil,
  renderRecommendationActions,
  renderPinnedCharacters,
  renderOwnedUpwardList,
  renderMaterialTree as renderMaterialTreeUtil,
  renderOwnedCountCard as renderOwnedCountCardUtil,
} from './recommend-render.js';
import {
  getPinnedCharacters as getPinnedCharactersUtil,
  togglePinnedCharacter as togglePinnedCharacterUtil,
  addPinnedCharacters,
  clearPinnedCharacters as clearPinnedCharactersUtil,
  removePinnedCharacter,
} from './recommend-storage.js';
import { createTmoPoller } from './recommend-tmo.js';
import { encodeTeamCharacterIds } from './../shared/team-codec.js';

const {
  compareRecords,
  createIndices,
  createTomSelectOptions,
  createTomSelectRenderConfig,
  escapeHtml,
  getLevelLabel,
  getPrimaryRecord,
  getSkillTypeLabel,
  getDisplayName,
} = appShared;

const i18n = ORDI18n || (typeof window !== 'undefined' ? window.ORDI18n : null) || null;
const t = i18n && typeof i18n.t === 'function' ? i18n.t : (key) => key;

// 預設顯示100筆
let DEFAULT_SHOW_AMOUNT = 100;

function getCompletionRatio({ scoreOwned, scoreTotal }) {
  return scoreTotal > 0 ? scoreOwned / scoreTotal : 0;
}

function initRecommendPage(records) {
    const indices = createIndices(records);
    const openSkills = createSkillDialog();
    const analyzeRecipe = createRecipeAnalyzer(indices);
    const materialCompletionCache = new Map();
    const targetLevelGrid = document.getElementById('recommendTargetLevelGrid');
    const targetSkillGrid = document.getElementById('recommendTargetSkillGrid');
    const ownedSelect = document.getElementById('recommendOwnedSelect');
    const ownedTabs = document.getElementById('recommendOwnedTabs');
    const ownedPanels = document.getElementById('recommendOwnedPanels');
    const resultList = document.getElementById('recommendResultList');
    const pinnedList = document.getElementById('recommendPinnedList');
    const recommendSearchInput = document.getElementById('recommendSearchInput');
    const summary = document.getElementById('recommendSummary');
    const refreshButton = document.getElementById('recommendRefreshBtn');
    const resetButton = document.getElementById('recommendResetBtn');
    const collapseFilterButton = document.getElementById('collapseFilterBtn');
    const rarityFilter = document.getElementById('recommendRarityFilter');
    const skillFilter = document.getElementById('recommendSkillFilter');
    const exportHighLevelButton = document.getElementById('recommendExportHighLevelBtn');
    const exportHighLevelDialog = document.getElementById('recommendExportHighLevelDialog');
    const highLevelCharacters = document.getElementById('recommendHighLevelCharacters');
    const highLevelCode = document.getElementById('recommendHighLevelCode');
    const copyHighLevelCodeButton = document.getElementById('recommendCopyHighLevelCode');
    const copyHighLevelCodeStatus = document.getElementById('recommendCopyHighLevelStatus');
    const level1Records = [...records.filter((record) => record.level === 1)].sort((left, right) => {
      const sortId = ['1-8','1-5','1-4','1-9','1-3','1-6','1-2','1-7','1-1'];
      let leftIndex = sortId.indexOf(left.character_id);
      let rightIndex = sortId.indexOf(right.character_id);
      if (leftIndex === -1) leftIndex = Infinity;
      if (rightIndex === -1) rightIndex = Infinity;
      return leftIndex - rightIndex;
    });
    const level2Records = [...records.filter((record) => record.level === 2)].sort(compareRecords);
    const extraRecords = [...records.filter((record) => record.level > 2)].sort(compareRecords);
    const targetOptions = buildTargetLevelOptionsUtil(records, getLevelLabel);
    const shortagePriorityLevels = [...new Set(records.map((record) => Number(record.level)).filter((level) => Number.isFinite(level) && level >= 0))]
      .sort((left, right) => right - left);
    const hasTomSelect = typeof window.TomSelect === 'function';
    const defaultTargetLevels = new Set([]);
    const ownedCountState = {
      1: new Map(),
      2: new Map(),
    };
    const targetState = {
      activeOwnedLevel: 1,
      selectedTargetLevels: new Set(defaultTargetLevels),
      checkedSkillTypes: new Set(),
    };
    let dismissedCharacterIds = new Set();
    let activeResultLevel = null;
    let recommendationSearchQuery = '';
    let renderedPinnedHtml = '';

    function normalizeSearchText(value) {
      return String(value || '').normalize('NFKC').toLowerCase();
    }

    function matchesRecommendationSearch(record) {
      if (!recommendationSearchQuery) {
        return true;
      }

      const searchableText = normalizeSearchText([
        getDisplayName(record),
        record.name,
        record.en_name,
        record.kr_name,
        record.character_id,
        record.key_code,
      ].join(' '));
      return searchableText.includes(recommendationSearchQuery);
    }

    const ownedSelector = hasTomSelect
      ? new window.TomSelect(ownedSelect, {
          options: [],
          valueField: 'value',
          labelField: 'label',
          searchField: ['label', 'value', 'kr_name', 'en_name'],
          maxOptions: 400,
          create: false,
          persist: false,
          placeholder: '',
          render: createTomSelectRenderConfig(),
          dropdownParent: 'body',
          plugins: ['remove_button'],
          duplicates: true,     // 允許重複選擇同一個項目
          hideSelected: false,  // 已選過的項目依然顯示在下拉選單中
        })
      : null;
    //window.ownedSelector = ownedSelector;

    function createCurrentInventory() {
      const selectedOwnedIds = ownedSelector
        ? normalizeOwnedValuesUtil(ownedSelector.getValue())
        : Array.from(ownedSelect.selectedOptions).map((option) => option.value);
      return createInventoryMapUtil(records, ownedCountState, selectedOwnedIds);
    }

    function loadMaterialTree(details, openKeys) {
      if (!resultList.contains(details) || !details.open || details.dataset.treeLoaded === 'true') {
        return;
      }

      const record = indices.byCharacterId.get(details.dataset.characterId);
      const container = details.querySelector('[data-material-tree-container]');
      if (!record || !container) {
        return;
      }

      const inventory = createCurrentInventory();
      // 從目前 DOM 路徑取得祖先，避免循環配方無限展開。
      const trail = new Set();
      let ancestor = details;
      while (ancestor) {
        trail.add(ancestor.dataset.characterId);
        ancestor = ancestor.parentElement?.closest('details[data-character-id]');
      }
      const getMaterialCompletion = (characterId) => {
        if (!materialCompletionCache.has(characterId)) {
          const { status } = analyzeRecipe(characterId, inventory);
          materialCompletionCache.set(characterId, Math.max(0, Math.min(1, getCompletionRatio(status))));
        }
        return materialCompletionCache.get(characterId);
      };
      container.innerHTML = `
        <ul class="recommend-material-tree">
          ${renderMaterialTreeUtil(record, inventory, indices, getLevelLabel, getDisplayName, escapeHtml, trail, details.dataset.treeKey, getMaterialCompletion)}
        </ul>
      `;
      details.dataset.treeLoaded = 'true';

      if (openKeys) {
        container.querySelectorAll('details[data-tree-key]').forEach((childDetails) => {
          childDetails.open = openKeys.has(childDetails.dataset.treeKey);
          // 只重建先前展開的路徑，收合分支仍保留延後載入。
          if (childDetails.open) loadMaterialTree(childDetails, openKeys);
        });
      }
    }

    function renderTargetLevelCheckboxes() {
      targetLevelGrid.innerHTML = targetOptions
        .map(
          (option) => `
            <label class="checkbox-badge">
              <input type="checkbox" value="${escapeHtml(String(option.value))}" ${targetState.selectedTargetLevels.has(option.value) ? 'checked' : ''}>
              <span class="checkbox-badge-label badge-${option.value}">${escapeHtml(option.label)}</span>
            </label>
          `
        )
        .join('');

      targetLevelGrid.querySelectorAll('input').forEach((input) => {
        input.addEventListener('change', () => {
          const level = Number(input.value);
          if (input.checked) {
            targetState.selectedTargetLevels.add(level);
          } else {
            targetState.selectedTargetLevels.delete(level);
          }
          scheduleRecommendationsRender();
        });
      });
    }

    function renderOwnedTabs() {
      const tabs = [
        { level: 1, label: `${getLevelLabel(1)}`, count: countMapTotalUtil(ownedCountState[1]) },
        { level: 2, label: `${getLevelLabel(2)}`, count: countMapTotalUtil(ownedCountState[2]) },
      ];

      ownedTabs.innerHTML = tabs
        .map(
          (tab) => `
            <button type="button" class="comp-tree-tab-btn ${targetState.activeOwnedLevel === tab.level ? 'active' : ''}" data-owned-tab="${tab.level}">
              ${escapeHtml(tab.label)}
              <span class="recommend-tab-count">${tab.count}</span>
            </button>
          `
        )
        .join('');
    }

    function renderOwnedPanels() {
      //console.log('lv1',level1Records)
      ownedPanels.innerHTML = [
        { level: 1, records: level1Records },
        { level: 2, records: level2Records },
      ]
        .map(({ level, records: levelRecords }) => {
          const isActive = targetState.activeOwnedLevel === level;
          return `
            <div class="recommend-owned-panel ${isActive ? 'active' : 'is-hidden'}" data-owned-panel="${level}">
              <div class="recommend-count-grid">
                ${levelRecords
                  .map((record) => renderOwnedCountCardUtil(record, ownedCountState[level].get(record.character_id) || 0, level, getDisplayName, escapeHtml))
                  .join('')}
              </div>
              ${levelRecords.length === 0 ? '<div class="empty-state">沒有可用角色。</div>' : ''}
            </div>
          `;
        })
        .join('');
    }

    function syncOwnedOptions() {
      const options = createTomSelectOptions(extraRecords);
      if (!ownedSelector) {
        ownedSelect.replaceChildren(...options.map(({ label, value }) => new Option(label, value)));
        return;
      }

      ownedSelector.clear(true);
      ownedSelector.clearOptions();
      ownedSelector.addOptions(options);
      ownedSelector.refreshOptions(false);
    }
    // 固定禁止推薦
    const defaultDismissedIds = ['2-12', '4-7', '4-46', '5-41', '6-10', '10-1', '5-10'];

    function computeRecommendations() {
      const selectedTargetLevels = [...targetState.selectedTargetLevels].sort((left, right) => left - right);
      const inventory = createCurrentInventory();
      const selectedTargetSkillTypes = [...targetState.checkedSkillTypes];

      if (selectedTargetLevels.length === 0) {
        return {
          inventory,
          resultGroups: [],
          selectedTargetLevels,
          selectedTargetSkillTypes,
        };
      }

      const pinnedCharacterIds = new Set(getPinnedCharactersUtil());
      const resultGroups = selectedTargetLevels
        .map((targetLevel) => {
          const candidates = records
            .filter((record) => record.level === targetLevel 
            && (pinnedCharacterIds.has(record.character_id) || !defaultDismissedIds.includes(record.character_id))
            && matchesRecommendationSearch(record)
            && (selectedTargetSkillTypes.length === 0 || record.skill_types?.some((skillType) => selectedTargetSkillTypes.includes(skillType))))
            .map((record) => {
              // 整併計算缺口與完成度分數
              const analyzeResult = analyzeRecipe(record.character_id, new Map(inventory), indices);
              const completionRatio = getCompletionRatio(analyzeResult.status).toFixed(7);
              return {
                record,
                requiredCounts : analyzeResult.missingBaseCounts,
                requiredText: formatRequiredBaseMaterialsFromCountsUtil(analyzeResult.missingBaseCounts, indices, getPrimaryRecord, getDisplayName),
                excessCounts: analyzeResult.excessCounts,
                excessText: formatExcessMaterialsFromCountsUtil(analyzeResult.excessCounts, indices, getPrimaryRecord, getDisplayName),
                missingTierCounts: analyzeResult.missingTierCounts,
                completionRatio,
                isPinned: pinnedCharacterIds.has(record.character_id),
              };
            })
            .sort((left, right) => {
              // pinned first
              if (left.isPinned && !right.isPinned) {
                return -1;
              }
              if (!left.isPinned && right.isPinned) {
                return 1;
              }
              // 🌟 排序策略 1：優先推薦「完成度（Ratio）最高」的（從 1.0 降序到 0.0）
              if (right.completionRatio !== left.completionRatio) {
                return right.completionRatio - left.completionRatio;
              }
              // 🌟 排序策略 2：如果完成度一樣，再比對缺口分布（先比高難度缺口）
              const shortageCompare = compareMissingTierCountsUtil(left.missingTierCounts, right.missingTierCounts, shortagePriorityLevels);
              if (shortageCompare !== 0) {
                return shortageCompare;
              }

              return compareRecords(left.record, right.record);
            })
            .filter(({ record }) => !dismissedCharacterIds.has(record.character_id))
            .slice(0, DEFAULT_SHOW_AMOUNT);

          return { targetLevel, candidates };
        })
        .filter((group) => group.candidates.length > 0);

      return {
        inventory,
        resultGroups,
        selectedTargetLevels,
        selectedTargetSkillTypes,
      };
    }

    function renderRecommendationResults(recommendations) {
      // 本輪展開的卡片共用材料進度；持有資料更新後不沿用舊結果。
      materialCompletionCache.clear();
      const {
        inventory,
        resultGroups,
        selectedTargetLevels,
        selectedTargetSkillTypes,
      } = recommendations;
      const openKeys = new Set();
      resultList.querySelectorAll('details[open][data-tree-key]').forEach((el) => {
        openKeys.add(el.dataset.treeKey);
      });

      if (selectedTargetLevels.length === 0) {
        // summary.textContent = i18n.t('recommend.noTargetRaritySelected');
        resultList.innerHTML = `<div class="empty-state">${i18n.t('recommend.noTargetRaritySelected')}</div>`;
        renderLevelTabs([]);
        return;
      }

      // summary.textContent = `${i18n.t('recommend.selected')}：${selectedTargetLevels.map((level) => `${getLevelLabel(level)}`).join(', ')}，
      //   ${i18n.t('skill_type')}: ${selectedTargetSkillTypes.length > 0 ? selectedTargetSkillTypes.map((skillType) => `${getSkillTypeLabel(skillType)}`).join(', ') : i18n.t('comp.materials.none')}`;

      if (resultGroups.length === 0) {
        resultList.innerHTML = `<div class="empty-state">${recommendationSearchQuery
          ? escapeHtml(i18n.t('recommend.no_search_results'))
          : '此條件沒有可推薦的角色。'}</div>`;
        renderLevelTabs(selectedTargetLevels);
        return;
      }
      //console.log('resultGroups',resultGroups)
      resultList.innerHTML = resultGroups
        .map(
          (group) => `
            <section class="recommend-result-group" data-level="${group.targetLevel}">
              <div class="recommend-result-group-head">
                <h3 class="recommend-result-group-title text-lv-${group.targetLevel}">${escapeHtml(`${getLevelLabel(group.targetLevel)}`)}</h3>
              </div>
              <div class="recommend-result-group-body">
                ${group.candidates
                  .map(({ record, requiredCounts, requiredText, excessCounts, excessText, completionRatio, isPinned }) => {
                    const completion = Number(completionRatio) || 0;
                    const skillLabels = formatSkillLabelsWithValuesUtil(
                      record.skill_types,
                      record.skill_values,
                      getSkillTypeLabel
                    );
                    const remark = String(record.remark ?? '').trim();
                    return `
                      <article class="recommend-card ${isPinned ? 'card-pinned' : ''}">
                        <div class="card-top-progress-container" aria-hidden="true">
                          <div class="card-top-progress-bar-bg" style="transform: scaleX(${completion});"></div>
                        </div>
                        <div class="recommend-card-heading">
                          <div class="recommend-card-top">
                            <strong>${escapeHtml(getDisplayName(record))} ${record.key_code ? `(${escapeHtml(record.key_code)})` : ''}</strong>
                            <span class="recommend-card-completion">${(completion * 100).toFixed(0)}%</span>
                          </div>
                          ${renderRecommendationActions(record, indices, getDisplayName, escapeHtml, t, isPinned, DEFAULT_SHOW_AMOUNT !== 100)}
                        </div>
                        ${skillLabels.length || remark ? `
                          <div class="recommend-card-meta">
                            ${skillLabels.length ? `<span class="badge-skill-type">${skillLabels.map(escapeHtml).join(' / ')}</span>` : ''}
                            ${remark ? `<span>${escapeHtml(remark)}</span>` : ''}
                          </div>
                        ` : ''}
                        <details class="branch-details recommend-material-details" data-tree-key="${record.character_id}" data-character-id="${escapeHtml(record.character_id)}">
                          <summary class="branch-summary recommend-material-summary">
                            <div class="recommend-material-summary-head">
                              <span class="recommend-material-summary-label">${i18n.t('materials')}</span>
                              <span class="branch-toggle-hint">
                                <img width="18" height="18" src="/resource/arrow_drop_down.svg" alt="">
                              </span>
                            </div>
                            <div class="recommend-material-preview">
                              ${renderMaterialPreviewUtil(record, inventory, indices, getDisplayName, escapeHtml)}
                            </div>
                          </summary>
                          <div class="recommend-material-body" data-material-tree-container></div>
                        </details>
                        ${requiredCounts.size > 0 || excessCounts.size > 0 ? `
                          <div class="recommend-card-statuses">
                            ${requiredCounts.size > 0 ? `<span class="recommend-shortage">${i18n.t('recommend.needMaterials')}: ${escapeHtml(requiredText)}</span>` : ''}
                            ${excessCounts.size > 0 ? `<span class="recommend-excess">${i18n.t('recommend.excessMaterials')}: ${escapeHtml(excessText)}</span>` : ''}
                          </div>
                        ` : ''}
                      </article>
                    `;
                  })
                  .join('')}
              </div>
            </section>
          `
        )
        .join('');
      //scroll to top
      //resultList.scrollTo({ top: 0, behavior: 'smooth' });
      // 恢復先前展開的狀態
      if (openKeys.size > 0) {
        resultList.querySelectorAll('details[data-tree-key]').forEach((el) => {
          if (openKeys.has(el.dataset.treeKey)) {
            el.open = true; // 將 open 屬性設回 true
            loadMaterialTree(el, openKeys);
          }
        });
      }
      renderLevelTabs(selectedTargetLevels);
    }

    function renderLevelTabs(selectedTargetLevels) {
      const recommendLevelTab = document.getElementById('recommendLevelTab');
      if (!recommendLevelTab) {
        return;
      }

      if (selectedTargetLevels.length === 0) {
        activeResultLevel = null;
        recommendLevelTab.innerHTML = '';
        return;
      }

      if (!selectedTargetLevels.includes(activeResultLevel)) {
        activeResultLevel = selectedTargetLevels[0];
      }

      recommendLevelTab.innerHTML = selectedTargetLevels
        .map((level) => `<a class="recommend-level-tab ${level === activeResultLevel ? 'active' : ''}" data-level="${level}">
          ${escapeHtml(getLevelLabel(level))}</a>`)
        .join('');
      setActiveResultLevel(activeResultLevel);
    }

    function setActiveResultLevel(level) {
      activeResultLevel = level;
      document.querySelectorAll('.recommend-level-tab').forEach((button) => {
        button.classList.toggle('active', Number(button.dataset.level) === level);
      });
      resultList.querySelectorAll('.recommend-result-group').forEach((group) => {
        group.classList.toggle('collapsed', Number(group.dataset.level) !== level);
      });
    }

    function renderOwnedControls() {
      renderOwnedTabs();
      renderOwnedPanels();
    }

    function setActiveOwnedPanel(level) {
      targetState.activeOwnedLevel = level;
      ownedTabs.querySelectorAll('[data-owned-tab]').forEach((tab) => {
        tab.classList.toggle('active', Number(tab.dataset.ownedTab) === level);
      });
      ownedPanels.querySelectorAll('[data-owned-panel]').forEach((panel) => {
        const isActive = Number(panel.dataset.ownedPanel) === level;
        panel.classList.toggle('active', isActive);
        panel.classList.toggle('is-hidden', !isActive);
      });
    }

    function renderRecommendations() {
      const pinnedHtml = renderPinnedCharacters(
        getPinnedCharactersUtil(),
        indices.byCharacterId,
        getDisplayName,
        escapeHtml,
        t
      );
      if (pinnedHtml !== renderedPinnedHtml) {
        pinnedList.innerHTML = pinnedHtml;
        renderedPinnedHtml = pinnedHtml;
      }
      renderRecommendationResults(computeRecommendations());
    }

    let scheduledRenderFrame = null;
    let shouldRenderOwnedControls = false;
    let afterRenderCallbacks = [];

    function scheduleRecommendationsRender(options) {
      const {
        renderOwnedControls: shouldRenderOwnedControlsNow = false,
        afterRender,
      } = options && typeof options === 'object' ? options : {};
      shouldRenderOwnedControls ||= shouldRenderOwnedControlsNow;

      if (typeof afterRender === 'function') {
        afterRenderCallbacks.push(afterRender);
      }

      if (scheduledRenderFrame !== null) {
        return;
      }

      scheduledRenderFrame = requestAnimationFrame(() => {
        scheduledRenderFrame = null;
        const shouldRenderOwnedControlsNow = shouldRenderOwnedControls;
        shouldRenderOwnedControls = false;
        if (shouldRenderOwnedControlsNow) {
          renderOwnedControls();
        }
        renderRecommendations();

        const callbacks = afterRenderCallbacks;
        afterRenderCallbacks = [];
        callbacks.forEach((callback) => callback());
      });
    }

    function setOwnedCardCount(level, characterId, delta) {
      const current = ownedCountState[level].get(characterId) || 0;
      const next = Math.max(0, current + delta);
      if (next === 0) {
        ownedCountState[level].delete(characterId);
      } else {
        ownedCountState[level].set(characterId, next);
      }
      scheduleRecommendationsRender({ renderOwnedControls: true });
    }
    
    renderTargetLevelCheckboxes();
    const skillTypeFilter = createSkillTypeFilter(
      targetSkillGrid,
      targetState.checkedSkillTypes,
      scheduleRecommendationsRender
    );
    renderOwnedControls();
    syncOwnedOptions();
    renderRecommendations();

    refreshButton.addEventListener('click', () => {
      dismissedCharacterIds = new Set();
      scheduleRecommendationsRender();
    });

    function setFiltersExpanded(expanded) {
      rarityFilter.hidden = !expanded;
      skillFilter.hidden = !expanded;

      const labelKey = expanded ? 'recommend.collapseFilters' : 'recommend.expandFilters';
      collapseFilterButton.setAttribute('aria-expanded', String(expanded));
      collapseFilterButton.dataset.i18nAriaLabel = labelKey;
      collapseFilterButton.dataset.i18nTitle = labelKey;
      collapseFilterButton.setAttribute('aria-label', t(labelKey));
      collapseFilterButton.title = t(labelKey);
    }

    resetButton.addEventListener('click', () => {
      dismissedCharacterIds = new Set();
      recommendationSearchQuery = '';
      if (recommendSearchInput) {
        recommendSearchInput.value = '';
      }
      targetState.selectedTargetLevels = new Set();
      skillTypeFilter.reset();
      targetState.activeOwnedLevel = 1;
      ownedCountState[1].clear();
      ownedCountState[2].clear();
      if (ownedSelector) {
        ownedSelector.clear(true);
      } else {
        Array.from(ownedSelect.options).forEach((option) => {
          option.selected = false;
        });
      }
      renderTargetLevelCheckboxes();
      scheduleRecommendationsRender({ renderOwnedControls: true });
      setFiltersExpanded(true);
    });

    ownedTabs.addEventListener('click', (event) => {
      const button = event.target.closest('[data-owned-tab]');
      if (!button) {
        return;
      }

      setActiveOwnedPanel(Number(button.dataset.ownedTab || 1));
    });

    ownedPanels.addEventListener('click', (event) => {
      const button = event.target.closest('[data-owned-id][data-owned-delta]');
      if (!button) {
        return;
      }

      const level = Number(button.closest('[data-owned-card]')?.dataset.ownedLevel || 1);
      const characterId = String(button.dataset.ownedId || '');
      const delta = Number(button.dataset.ownedDelta || 0);
      if (!characterId || !Number.isFinite(delta)) {
        return;
      }

      setOwnedCardCount(level, characterId, delta);
    });

    resultList.addEventListener('click', (event) => {
      const skillButton = event.target.closest('[data-view-skills]');
      if (skillButton) {
        const record = indices.byCharacterId.get(skillButton.dataset.viewSkills);
        if (record) openSkills(record, getDisplayName(record), i18n?.getLang() === 'en');
        return;
      }
      // 點擊「隱藏此推薦」按鈕
      let needRender = false;
      const button = event.target.closest('[data-dismiss-character]');
      if (button) {
        needRender = true;
        dismissedCharacterIds.add(String(button.dataset.dismissCharacter || ''));
      }
      // 點擊「釘選」按鈕
      const pinButton = event.target.closest('[data-pinned-character]');
      let pinnedId = '';
      if (pinButton) {
        needRender = true;
        pinnedId = String(pinButton.dataset.pinnedCharacter || '');
        if(!togglePinnedCharacterUtil(pinnedId)){
          pinnedId = ''; // 如果取消釘選，則不需要聚焦
        }
      }
      if (needRender) {
        scheduleRecommendationsRender({
          afterRender: () => {
            if (!pinnedId) {
              return;
            }

            resultList.querySelector(`[data-pinned-character="${pinnedId}"]`)?.focus();
          },
        });
      }
    });

    const recommendLevelTab = document.getElementById('recommendLevelTab');
    recommendLevelTab?.addEventListener('click', (event) => {
      const button = event.target.closest('.recommend-level-tab');
      if (!button || !recommendLevelTab.contains(button)) {
        return;
      }

      const level = Number(button.dataset.level);
      if (!Number.isFinite(level)) {
        return;
      }

      setActiveResultLevel(level);
    });

    resultList.addEventListener('toggle', (event) => {
      if (!(event.target instanceof HTMLDetailsElement)
        || !event.target.matches('.recommend-material-details, .recommend-material-branch')) {
        return;
      }

      loadMaterialTree(event.target);
    }, true);

    if (ownedSelector) {
      ownedSelector.on('change', scheduleRecommendationsRender);
    } else {
      ownedSelect.addEventListener('change', scheduleRecommendationsRender);
    }

    recommendSearchInput?.addEventListener('input', () => {
      recommendationSearchQuery = normalizeSearchText(recommendSearchInput.value).trim();
      scheduleRecommendationsRender();
    });

    collapseFilterButton.addEventListener('click', () => {
      skillTypeFilter.closeOptions();
      setFiltersExpanded(rarityFilter.hidden);
    });
    const recommendOwnedTitle = document.getElementById('recommendOwnedTitle');
    if (recommendOwnedTitle) {
      recommendOwnedTitle.addEventListener('click', () => {
        const ownedPanel = document.querySelector('#recommendOwnedPanels');
        if (ownedPanel) {
          ownedPanel.classList.toggle('collapsed');
        }
        const recommendOwnedTabs = document.getElementById('recommendOwnedTabs');
        if (recommendOwnedTabs) {
          recommendOwnedTabs.classList.toggle('collapsed');
        }
      });
    }
    const tmoConnectStatus = document.getElementById('tmoConnectStatus');
    const tmoToggle = document.getElementById('tmoConnectToggle');
    const modePicker = document.getElementById('recommendModePicker');
    const workspace = document.getElementById('recommendWorkspace');
    const autoModeControls = workspace.querySelectorAll('[data-auto-only]');
    const modeLabel = document.getElementById('recommendModeLabel');

    function stopAutoSync() {
      if (tmoToggle.checked) {
        tmoToggle.checked = false;
        tmoToggle.dispatchEvent(new Event('change'));
      }
    }

    document.querySelectorAll('[data-recommend-mode]').forEach((button) => {
      button.addEventListener('click', () => {
        const isAuto = button.dataset.recommendMode === 'auto';
        stopAutoSync();
        modePicker.hidden = true;
        workspace.hidden = false;
        autoModeControls.forEach((element) => {
          element.hidden = !isAuto;
        });
        document.querySelectorAll('[data-manual-only]').forEach((element) => {
          element.hidden = isAuto;
        });
        modeLabel.textContent = t(`recommend.mode.${isAuto ? 'auto_label' : 'manual_title'}`);
        // 手動模式直接展開角色數量，讓使用者可以立即輸入。
        if (!isAuto) {
          ownedTabs.classList.remove('collapsed');
          ownedPanels.classList.remove('collapsed');
        }
        modeLabel.focus();
      });
    });

    document.getElementById('recommendChangeModeBtn')?.addEventListener('click', () => {
      stopAutoSync();
      workspace.hidden = true;
      modePicker.hidden = false;
      modePicker.querySelector('[data-recommend-mode]')?.focus();
    });

    document.querySelectorAll('[data-tmo-tutorial]').forEach((button) => {
      button.addEventListener('click', () => document.getElementById('thirdPartyTutorialModal')?.open());
    });

    createTmoPoller({
      indices,
      ownedCountState,
      ownedSelector,
      scheduleRecommendationsRender,
      tmoConnectStatus,
      tmoToggle,
      t: (key) => i18n.t(key),
    }).bind();
    //show less button begin
    const recommendShowLessBtn = document.getElementById('recommendShowLessBtn');
    if (recommendShowLessBtn) {
      recommendShowLessBtn.addEventListener('click', () => {
        DEFAULT_SHOW_AMOUNT = DEFAULT_SHOW_AMOUNT === 10 ? 100 : 10;
        recommendShowLessBtn.textContent = DEFAULT_SHOW_AMOUNT === 10 ? i18n.t('action.showMore') : i18n.t('action.showLess');
        scheduleRecommendationsRender();
      })
    }
    //shoow less button end
    const recommendClearPinnedBtn = document.getElementById('recommendClearPinnedBtn');
    recommendClearPinnedBtn.addEventListener('click', () => {
      clearPinnedCharactersUtil();
      scheduleRecommendationsRender();
    });

    pinnedList.addEventListener('click', (event) => {
      const button = event.target.closest('[data-remove-pinned-character]');
      if (!button) {
        return;
      }

      const buttons = [...pinnedList.querySelectorAll('[data-remove-pinned-character]')];
      const removedIndex = buttons.indexOf(button);
      const restoreFocus = document.activeElement === button;
      removePinnedCharacter(button.dataset.removePinnedCharacter);
      scheduleRecommendationsRender({
        afterRender: () => {
          if (!restoreFocus || !pinnedList.closest(':popover-open')) {
            return;
          }
          const remaining = pinnedList.querySelectorAll('[data-remove-pinned-character]');
          const nextButton = remaining[removedIndex] || remaining[remaining.length - 1] || recommendClearPinnedBtn;
          nextButton.focus();
        },
      });
    });

    const ownedUpwardDialog = document.getElementById('recommendOwnedUpwardDialog');
    const ownedUpwardList = document.getElementById('recommendOwnedUpwardList');
    const applyOwnedUpwardButton = document.getElementById('recommendApplyOwnedUpwardBtn');

    document.getElementById('recommendOwnedUpwardBtn').addEventListener('click', () => {
      ownedUpwardList.innerHTML = renderOwnedUpwardList(
        indices.records,
        createCurrentInventory(),
        indices,
        getLevelLabel,
        getDisplayName,
        escapeHtml,
        t
      );
      applyOwnedUpwardButton.disabled = true;
      ownedUpwardDialog.showModal();
    });

    ownedUpwardList.addEventListener('toggle', (event) => {
      const group = event.target;
      if (!(group instanceof HTMLDetailsElement) || !group.open) {
        return;
      }

      const inventory = createCurrentInventory();
      group.querySelectorAll('li').forEach((row) => {
        const characterId = row.querySelector('input').value;
        const { status } = analyzeRecipe(characterId, inventory);
        const percent = Math.round(Math.max(0, Math.min(1, getCompletionRatio(status))) * 100);
        row.querySelector('progress').value = percent;
        row.querySelector('.recommend-owned-upward-progress span').textContent = `${percent}%`;
      });
    }, true);

    ownedUpwardList.addEventListener('change', (event) => {
      const changedInput = event.target;
      ownedUpwardList.querySelectorAll('input').forEach((input) => {
        if (input.value === changedInput.value) {
          input.checked = changedInput.checked;
        }
      });
      applyOwnedUpwardButton.disabled = !ownedUpwardList.querySelector('input:checked');
    });

    ownedUpwardDialog.querySelector('form').addEventListener('submit', (event) => {
      if (event.submitter !== applyOwnedUpwardButton) {
        return;
      }

      const selectedIds = new Set(new FormData(event.currentTarget).getAll('upwardTarget'));
      const selectedRecords = [...selectedIds].map((id) => indices.byCharacterId.get(id));
      if (selectedRecords.length === 0) {
        event.preventDefault();
        return;
      }

      addPinnedCharacters(selectedIds);
      selectedRecords.forEach((record) => {
        targetState.selectedTargetLevels.add(record.level);
        dismissedCharacterIds.delete(record.character_id);
      });
      activeResultLevel = selectedRecords[0].level;
      renderTargetLevelCheckboxes();
      scheduleRecommendationsRender();
    });

    function getOwnedHighLevelRecords() {
      const selectedOwnedIds = ownedSelector
        ? normalizeOwnedValuesUtil(ownedSelector.getValue())
        : Array.from(ownedSelect.selectedOptions).map((option) => option.value);
      const ownedIds = new Set(selectedOwnedIds);
      return extraRecords.filter((record) => record.level >= 5 && ownedIds.has(record.character_id));
    }

    exportHighLevelButton?.addEventListener('click', () => {
      const ownedRecords = getOwnedHighLevelRecords();
      highLevelCharacters.innerHTML = ownedRecords.length > 0
        ? ownedRecords
          .map((record) => `<li><span class="text-lv-${record.level}">${escapeHtml(getDisplayName(record))}</span></li>`)
          .join('')
        : `<li class="muted">${escapeHtml(i18n.t('recommend.no_high_level_characters'))}</li>`;
      highLevelCode.value = encodeTeamCharacterIds(ownedRecords.map((record) => record.character_id));
      if (copyHighLevelCodeStatus) {
        copyHighLevelCodeStatus.textContent = '';
      }
      exportHighLevelDialog?.open();
    });

    exportHighLevelDialog?.querySelector('[data-action="close"]')?.addEventListener('click', () => {
      exportHighLevelDialog.close();
    });

    copyHighLevelCodeButton?.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(highLevelCode.value);
        if (copyHighLevelCodeStatus) {
          copyHighLevelCodeStatus.textContent = i18n.t('recommend.copy_success');
        }
      } catch (error) {
        console.error('Failed to copy team code:', error);
        if (copyHighLevelCodeStatus) {
          copyHighLevelCodeStatus.textContent = i18n.t('recommend.copy_failed');
        }
      }
    });
  }

if (typeof window !== 'undefined' && window.ORDApp) {
  window.ORDApp.initRecommendPage = initRecommendPage;
}

export default initRecommendPage;
