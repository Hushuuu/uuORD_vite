import appShared from './../shared/app-shared.js';
import { ORDI18n } from './../i18n.js';

const {
  compareRecords,
  createIndices,
  createTomSelectOptions,
  createTomSelectRenderConfig,
  escapeHtml,
  getLevelLabel,
  getPrimaryRecord,
  getSkillTypeLabels,
  getSkillTypeLabel,
  createSkillTypeOptions,
  getDisplayName,
  TMO_TRANSFER_DATA,
} = appShared;

const i18n = ORDI18n || (typeof window !== 'undefined' ? window.ORDI18n : null) || null;
const t = i18n && typeof i18n.t === 'function' ? i18n.t : (key) => key;

// 預設顯示100筆
let DEFAULT_SHOW_AMOUNT = 100;

function formatSkillLabelsWithValues(skillTypes = [], skillValues = {}) {
    return (skillTypes || []).map((skillType) => {
      const label = getSkillTypeLabel(skillType);
      const entry = skillValues?.[skillType];
      if (!entry || (entry.value === null && !(entry.remark || '').trim())) {
        return label;
      }
      const valueText = entry.value === null || entry.value === undefined ? '' : String(entry.value);
      const remarkText = (entry.remark ? ` ${entry.remark}` : '');
      return `${label}(${valueText}${remarkText})`;
    });
  }

  function buildTargetLevelOptions(records) {
    const levels = [...new Set(records.map((record) => Number(record.level)).filter((level) => Number.isFinite(level) && level > 2))]
      .sort((left, right) => left - right);

    return levels.map((level) => ({ value: level, label: `${getLevelLabel(level)}` }));
  }

  function countMapTotal(counts) {
    let total = 0;
    counts.forEach((count) => {
      total += count;
    });
    return total;
  }

  function normalizeOwnedValues(value) {
    if (Array.isArray(value)) {
      return value;
    }

    if (value === null || value === undefined || value === '') {
      return [];
    }

    return [value];
  }

  function createInventoryMap(records, ownedCountsByLevel, selectedOwnedIds) {
    const map = new Map();

    records.forEach((record) => {
      map.set(record.character_id, 0);
    });

    [1, 2].forEach((level) => {
      const counts = ownedCountsByLevel[level] || new Map();
      counts.forEach((count, characterId) => {
        map.set(characterId, (map.get(characterId) || 0) + Math.max(0, Number(count) || 0));
      });
    });

    selectedOwnedIds.forEach((characterId) => {
      map.set(characterId, (map.get(characterId) || 0) + 1);
    });

    return map;
  }

  function formatRequiredBaseMaterialsFromCounts(counts, indices) {
    const sortId = ['1-8','1-5','1-4','1-9','1-3','1-6','1-2','1-7','1-1']
    const segments = [...counts.entries()]
      .filter(([, count]) => count > 0)
      .sort((left, right) => {
        const leftId = left[0];
        const rightId = right[0];
        let leftIndex = sortId.indexOf(leftId);
        let rightIndex = sortId.indexOf(rightId);
        if (leftIndex === -1) leftIndex = Infinity;
        if (rightIndex === -1) rightIndex = Infinity;
        return leftIndex - rightIndex;
      })
      .map(([materialId, count]) => `${getDisplayName(getPrimaryRecord(materialId, indices)) || materialId}*${count}`);

    return segments.join(' + ') || '無需額外素材';
  }
/**
 * 一次走訪完成合成樹分析：權重進度、基礎材料缺口、階級缺口統計
 */
function analyzeRecipe(characterId, inventory, indices) {
  // 複製一份 inventory，避免污染傳入的原始物件（若需改動原物件可移除克隆）
  const inv = new Map(inventory);
  
  const rootRecord = indices.byCharacterId.get(characterId);
  if (!rootRecord) {
    return {
      status: { scoreOwned: 0, scoreTotal: 0 },
      missingBaseCounts: new Map(),
      missingTierCounts: new Map()
    };
  }

  // 初始化結果結構
  const result = {
    status: {
      scoreOwned: 0,
      scoreTotal: getRealWeight(rootRecord.character_id, indices) // 目標總分母
    },
    missingBaseCounts: new Map(), // collectRequiredBaseMaterialsCounts 的結果
    missingTierCounts: new Map()  // collectMissingTierCountsFromRecord 的結果
  };

  const visited = new Set();

  function traverse(record, isFirstCall = false) {
    if (!record || visited.has(record.character_id)) return;

    visited.add(record.character_id);

    const weight = getRealWeight(record.character_id, indices);
    const available = inv.get(record.character_id) || 0;

    // 1. 背包有現成素材：直接扣減並採計進度分數
    if (available > 0 && !isFirstCall) {
      inv.set(record.character_id, available - 1);
      result.status.scoreOwned += weight; // 拿到這個子素材的分數
      visited.delete(record.character_id);
      return; // 現成子素材滿足，不用再向下拆解
    }

    // 2. 背包沒有現成素材（產生缺口）
    // (A) 統計階級缺口 (Tier Counts) - 非第一層時記錄
    if (!isFirstCall) {
      const currentTierCount = result.missingTierCounts.get(record.level) || 0;
      result.missingTierCounts.set(record.level, currentTierCount + 1);
    }

    const materials = record.materials || [];
    const isBaseMaterial = materials.length === 0 || record.level === 1;

    // 3. 根據是否為最底層（Level 1 或無子材料）來處理基礎材料缺口
    if (isBaseMaterial) {
      // (B) 統計基礎材料缺口 (Base Counts)
      const currentBaseCount = result.missingBaseCounts.get(record.character_id) || 0;
      result.missingBaseCounts.set(record.character_id, currentBaseCount + 1);
    } else {
      // 4. 繼續遞迴向下拆解子材料
      materials.forEach((mat) => {
        const childRecord = indices.byCharacterId.get(mat.material_id);
        if (childRecord) {
          traverse(childRecord, false);
        } else {
          // 子紀錄不存在時的降級處理（作為基礎材料統計）
          const currentBaseCount = result.missingBaseCounts.get(mat.material_id) || 0;
          result.missingBaseCounts.set(mat.material_id, currentBaseCount + 1);
        }
      });
    }

    visited.delete(record.character_id);
  }

  // 開始執行走訪
  traverse(rootRecord, true);

  return result;
}  
  // 用來快取每隻角色的真實權重（總共相當於多少基礎物資）
  const realWeightCache = new Map();
  function getRealWeight(characterId, indices) {
    if (realWeightCache.has(characterId)) {
      return realWeightCache.get(characterId);
    }
    const record = indices.byCharacterId.get(characterId);
    if (!record) return 1;

    const materials = record.materials || [];
    if (record.level <= 1) {
      realWeightCache.set(characterId, 1);
      return 1;
    }else
    if (!materials.length) {
      const wt = Math.floor(4 * record.level);
      realWeightCache.set(characterId, wt);
      return wt;
    }

    let totalWeight = 0;
    materials.forEach((material) => {
      totalWeight += getRealWeight(material.material_id, indices);
    });

    realWeightCache.set(characterId, totalWeight);
    return totalWeight;
  }

  function compareMissingTierCounts(leftCounts, rightCounts, levelsDesc) {
    for (const level of levelsDesc) {
      const diff = (leftCounts.get(level) || 0) - (rightCounts.get(level) || 0);
      if (diff !== 0) {
        return diff;
      }
    }

    return 0;
  }

  function renderMaterialPreview(record, inventory, indices) {
    const materials = record.materials || [];
    if (!materials.length) {
      return '<span class="muted">無</span>';
    }

    return materials
      .map((material) => {
        const childRecord = indices.byCharacterId.get(material.material_id);
        const label = childRecord ? getDisplayName(childRecord) : material.material_id;
        const levelClass = childRecord ? `badge-${childRecord.level}` : 'badge-0';
        const owned = childRecord && (inventory.get(childRecord.character_id) || 0) > 0;
        return `
          <span class="recommend-material-chip badge ${levelClass}">
            <span class="recommend-material-chip-label">${escapeHtml(label)}</span>
            ${owned ? '<span class="recommend-owned-mark" aria-label="已擁有">✓</span>' : ''}
          </span>
        `;
      })
      .join('');
  }

  function renderMaterialTree(record, inventory, indices, trail = new Set(), parentPath = '') {
    const materials = record.materials || [];
    if (!materials.length) {
      return '';
    }

    return materials
      .map((material, index) => {
        const currentSegment = `${material.material_id}_${index}`;
        const treeKey = parentPath ? `${parentPath}/${currentSegment}` : currentSegment;
        const childRecord = indices.byCharacterId.get(material.material_id);
        if (!childRecord) {
          return `
            <li>
              <div class="recommend-material-row recommend-material-row--missing">
                <span class="badge badge-0">${escapeHtml(material.material_id)}</span>
                <span class="muted">未找到材料資料</span>
              </div>
            </li>
          `;
        }

        const owned = (inventory.get(childRecord.character_id) || 0) > 0;
        const ownedMark = owned ? '<span class="recommend-owned-mark" aria-label="已擁有">✓</span>' : '';
        const summaryContent = `
          <span class="recommend-material-chip badge badge-${childRecord.level}">${escapeHtml(getLevelLabel(childRecord.level))}</span>
          <strong class="recommend-material-name">${escapeHtml(getDisplayName(childRecord))}</strong>
          ${ownedMark}
        `;

        if (childRecord.level > 2 && (childRecord.materials || []).length && !trail.has(childRecord.character_id)) {
          const nextTrail = new Set(trail);
          nextTrail.add(childRecord.character_id);
          return `
            <li>
              <details class="branch-details recommend-material-branch" data-tree-key="${treeKey}">
                <summary class="branch-summary recommend-material-row">
                  ${summaryContent}
                  <span class="branch-toggle-hint">
                    <img style="vertical-align: middle" width="22" height="22" src="/resource/arrow_drop_down.svg" alt="展開">
                  </span>
                </summary>
                <ul class="recommend-material-tree">
                  ${renderMaterialTree(childRecord, inventory, indices, nextTrail, treeKey)}
                </ul>
              </details>
            </li>
          `;
        }

        return `
          <li>
            <div class="recommend-material-row recommend-material-row--leaf">
              ${summaryContent}
            </div>
          </li>
        `;
      })
      .join('');
  }

  function renderOwnedCountCard(record, count, level) {
    const safeCount = Math.max(0, Number(count) || 0);
    return `
      <article class="recommend-count-card ${safeCount > 0 ? 'is-owned' : ''}" data-owned-card="${escapeHtml(record.character_id)}" data-owned-level="${level}">
        <div class="recommend-count-card-top">
          <span class="recommend-count-label">${escapeHtml(getDisplayName(record))}</span>
        
        </div>
        <div class="recommend-count-stepper">
          <button type="button" class="recommend-stepper-btn" data-owned-id="${escapeHtml(record.character_id)}" data-owned-delta="-1" aria-label="減少 1">−</button>
          <span class="recommend-count-value">${safeCount}</span>
          <button type="button" class="recommend-stepper-btn" data-owned-id="${escapeHtml(record.character_id)}" data-owned-delta="1" aria-label="增加 1">+</button>
        </div>
      </article>
    `;
  }

  function initRecommendPage(records) {
    const indices = createIndices(records);
    const targetLevelGrid = document.getElementById('recommendTargetLevelGrid');
    const targetSkillGrid = document.getElementById('recommendTargetSkillGrid');
    const ownedSelect = document.getElementById('recommendOwnedSelect');
    const ownedTabs = document.getElementById('recommendOwnedTabs');
    const ownedPanels = document.getElementById('recommendOwnedPanels');
    const resultList = document.getElementById('recommendResultList');
    const summary = document.getElementById('recommendSummary');
    const refreshButton = document.getElementById('recommendRefreshBtn');
    const resetButton = document.getElementById('recommendResetBtn');
    const collapseFilterButton = document.getElementById('collapseFilterBtn');
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
    const targetOptions = buildTargetLevelOptions(records);
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
        ? normalizeOwnedValues(ownedSelector.getValue())
        : Array.from(ownedSelect.selectedOptions).map((option) => option.value);
      return createInventoryMap(records, ownedCountState, selectedOwnedIds);
    }

    function loadMaterialTree(details, openKeys) {
      if (!details.open || details.dataset.treeLoaded === 'true') {
        return;
      }

      const record = indices.byCharacterId.get(details.dataset.characterId);
      const container = details.querySelector('[data-material-tree-container]');
      if (!record || !container) {
        return;
      }

      container.innerHTML = `
        <ul class="recommend-material-tree">
          ${renderMaterialTree(record, createCurrentInventory(), indices, new Set(), record.character_id)}
        </ul>
      `;
      details.dataset.treeLoaded = 'true';

      if (openKeys) {
        container.querySelectorAll('details[data-tree-key]').forEach((childDetails) => {
          childDetails.open = openKeys.has(childDetails.dataset.treeKey);
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
        { level: 1, label: `${getLevelLabel(1)}`, count: countMapTotal(ownedCountState[1]) },
        { level: 2, label: `${getLevelLabel(2)}`, count: countMapTotal(ownedCountState[2]) },
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
                  .map((record) => renderOwnedCountCard(record, ownedCountState[level].get(record.character_id) || 0, level))
                  .join('')}
              </div>
              ${levelRecords.length === 0 ? '<div class="empty-state">沒有可用角色。</div>' : ''}
            </div>
          `;
        })
        .join('');
    }

    function syncOwnedOptions() {
      if (!ownedSelector) {
        return;
      }

      const options = createTomSelectOptions(extraRecords);
      ownedSelector.clear(true);
      ownedSelector.clearOptions();
      ownedSelector.addOptions(options);
      ownedSelector.refreshOptions(false);
    }
    //技能篩選
    function renderSkillTypeCheckboxes() {
      targetSkillGrid.innerHTML = createSkillTypeOptions()
        .map(
          ({ value, label }) => `
            <label class="checkbox-badge">
              <input type="checkbox" value="${escapeHtml(value)}" ${targetState.checkedSkillTypes.has(value) ? 'checked' : ''}>
              <span class="checkbox-badge-label">${escapeHtml(label)}</span>
            </label>
          `
        )
        .join('');

      targetSkillGrid.querySelectorAll('input').forEach((input) => {
        input.addEventListener('change', () => {
          if (input.checked) {
            targetState.checkedSkillTypes.add(input.value);
          } else {
            targetState.checkedSkillTypes.delete(input.value);
          }
          scheduleRecommendationsRender();
        });
      });
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

      const pinnedCharacterIds = new Set(getPinnedCharacters());
      const resultGroups = selectedTargetLevels
        .map((targetLevel) => {
          const candidates = records
            .filter((record) => record.level === targetLevel 
            && !defaultDismissedIds.includes(record.character_id)
            && (selectedTargetSkillTypes.length === 0 || record.skill_types?.some((skillType) => selectedTargetSkillTypes.includes(skillType))))
            .map((record) => {
              // 整併計算缺口與完成度分數
              const analyzeResult = analyzeRecipe(record.character_id, new Map(inventory), indices);
              const completionRatio = (analyzeResult.status.scoreTotal > 0 ? (analyzeResult.status.scoreOwned / analyzeResult.status.scoreTotal) : 0).toFixed(7);
              return {
                record,
                requiredCounts : analyzeResult.missingBaseCounts,
                requiredText: formatRequiredBaseMaterialsFromCounts(analyzeResult.missingBaseCounts, indices),
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
              const shortageCompare = compareMissingTierCounts(left.missingTierCounts, right.missingTierCounts, shortagePriorityLevels);
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
        summary.textContent = i18n.t('recommend.noTargetRaritySelected');
        resultList.innerHTML = `<div class="empty-state">${i18n.t('recommend.noTargetRaritySelected')}</div>`;
        renderLevelTabs([]);
        return;
      }

      summary.textContent = `${i18n.t('recommend.selected')}：${selectedTargetLevels.map((level) => `${getLevelLabel(level)}`).join(', ')}，
        ${i18n.t('skill_type')}: ${selectedTargetSkillTypes.length > 0 ? selectedTargetSkillTypes.map((skillType) => `${getSkillTypeLabel(skillType)}`).join(', ') : i18n.t('comp.materials.none')}`;

      const pinnedTextDom = document.getElementById('pinnedCharactersText');
      if (pinnedTextDom) {
        pinnedTextDom.innerHTML = buildPinnedCharactersHtml(records);
      }

      if (resultGroups.length === 0) {
        resultList.innerHTML = '<div class="empty-state">此條件沒有可推薦的角色。</div>';
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
                  .map(({ record, requiredText, completionRatio, isPinned }) => `
                    <article class="recommend-card ${isPinned ? 'card-pinned' : ''}">
                      <span tabindex="-1" style="position:absolute; top: 10px; right: 25px;" class="pinned-character-btn" data-pinned-character="${escapeHtml(record.character_id)}" aria-label="釘選">📌</span>
                      ${DEFAULT_SHOW_AMOUNT === 100 ? '' : `<span style="position:absolute; top: 10px; right: 2px;" class="recommend-dismiss-btn" data-dismiss-character="${escapeHtml(record.character_id)}" aria-label="隱藏此推薦">❌</span>`}
                      <div class="card-top-progress-container">
                        <div 
                          class="card-top-progress-bar-bg" 
                          style="transform: scaleX(${completionRatio || 0});"
                        ></div>
                        <div class="card-top-progress-text"
                        style="left: ${((completionRatio || 0) * 50).toFixed(2)}%;"
                        >
                          ${((completionRatio || 0) * 100).toFixed(0)}%
                        </div>
                      </div>
                      <div class="recommend-card-top">
                        <!--<span class="badge badge-${record.level}">${escapeHtml(getLevelLabel(record.level))}</span>-->
                        <strong>${escapeHtml(getDisplayName(record))} ${record.key_code ? `(${escapeHtml(record.key_code)})` : ''}</strong>
                      </div>
                      <div>
                        <span>${formatSkillLabelsWithValues(record.skill_types, record.skill_values).map((label) => `<span class="badge-skill-type">${escapeHtml(label)}</span>`).join('/')}</span>
                      </div>
                      <div style="margin-top: -10px; margin-bottom: -5px;">
                        <span class="badge-skill-type">${escapeHtml(record.remark)}</span>
                      </div>
                      <details class="branch-details recommend-material-details" data-tree-key="${record.character_id}" data-character-id="${escapeHtml(record.character_id)}">
                        <summary class="branch-summary recommend-material-summary">
                          <div class="recommend-material-summary-head">
                            <span class="recommend-material-summary-label">${i18n.t('materials')}</span>
                            <span class="branch-toggle-hint">
                              <img style="vertical-align: middle" width="22" height="22" src="/resource/arrow_drop_down.svg" alt="展開">
                            </span>
                          </div>
                          <div class="recommend-material-preview">
                            ${renderMaterialPreview(record, inventory, indices)}
                          </div>
                        </summary>
                        <div class="recommend-material-body" data-material-tree-container></div>
                      </details>
                      <div class="recommend-card-foot">
                        <span class="recommend-shortage ${requiredText === '無需額外素材' ? 'is-ready' : ''}">${requiredText === '無需額外素材' ? '' : `${i18n.t('recommend.needMaterials')}: ${escapeHtml(requiredText)}`}</span>
                        <span class="muted"></span>
                      </div>
                    </article>
                  `)
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
          ${level} | ${escapeHtml(getLevelLabel(level))}</a>`)
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
    renderSkillTypeCheckboxes();
    renderOwnedControls();
    syncOwnedOptions();
    renderRecommendations();

    refreshButton.addEventListener('click', () => {
      dismissedCharacterIds = new Set();
      scheduleRecommendationsRender();
    });

    resetButton.addEventListener('click', () => {
      dismissedCharacterIds = new Set();
      targetState.selectedTargetLevels = new Set();
      targetState.checkedSkillTypes = new Set();
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
      //console.log('重置技能篩選');
      renderSkillTypeCheckboxes();
      //console.log('重置技能篩選renderSkillTypeCheckboxes');
      scheduleRecommendationsRender({ renderOwnedControls: true });
      //重置條件區顯示
      const filterSections = document.querySelectorAll('.controls-grid .field-group');
      if (filterSections) {
        filterSections[0].classList.remove('collapsed');
        filterSections[1].classList.remove('collapsed');
        collapseFilterButton.innerText = i18n.t('action.collapseFilters');
      }
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
        if(!togglePinnedCharacter(pinnedId)){
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
        || !event.target.classList.contains('recommend-material-details')) {
        return;
      }

      loadMaterialTree(event.target);
    }, true);

    if (ownedSelector) {
      ownedSelector.on('change', scheduleRecommendationsRender);
    } else {
      ownedSelect.addEventListener('change', scheduleRecommendationsRender);
    }

    collapseFilterButton.addEventListener('click', () => {
      const filterSections = document.querySelectorAll('.controls-grid .field-group');
      if (filterSections) {
        filterSections[0].classList.toggle('collapsed');
        filterSections[1].classList.toggle('collapsed');
        collapseFilterButton.innerText = collapseFilterButton.innerText === i18n.t('comp.filters.collapse') ? i18n.t('comp.filters.expand') : i18n.t('comp.filters.collapse');
      }
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
    //timger tmogg api begin
    //tmoConnectStatus
    const tmoConnectStatus = document.getElementById('tmoConnectStatus');
    const tmoToggle = document.getElementById('tmoConnectToggle');
    let tmoTimerId = null; // 用來存 setTimeout 的 ID
    let activeFetchController = null; // 用來記錄「當前正在進行的 fetch」
    let tmoFailedCount = 0; // 記錄連線失敗次數
    async function pollTmoData() {
      // 1. 每次進來前，先確保清除舊的 timer
      if (tmoTimerId) {
        clearTimeout(tmoTimerId);
        tmoTimerId = null;
      }
      // 2. 防護機制：如果開關沒勾選，直接終止
      if (!tmoToggle || !tmoToggle.checked) {
        if (tmoConnectStatus) tmoConnectStatus.textContent = '';
        return;
      }
      // 3. 建立這次請求專屬的 AbortController
      activeFetchController = new AbortController();
      const timeoutId = setTimeout(() => activeFetchController?.abort(), 5000);
      const tmoProxyIpInput = document.getElementById('tmoProxyIpInput');
      try {
        let tmoEndpoint = __TMO_API_ENDPOINT__;
        let tAddSpace = 'loopback';
        if(tmoProxyIpInput && tmoProxyIpInput.value){
          //http://127.0.0.1:25626/datas
          tmoEndpoint = `https://${tmoProxyIpInput.value}:25626/datas`;
          tAddSpace = 'local';
        }
        const rs = await fetch(`${tmoEndpoint}`,{
          method: 'GET',
          targetAddressSpace: tAddSpace,
          signal: activeFetchController.signal // 綁定 signal
        });
        clearTimeout(timeoutId); // 成功拿到回應後清除 timeout

        if (rs.ok) {
          if(tmoConnectStatus){
            tmoConnectStatus.textContent = i18n.t('tmo.connect_success');
          }
          const data = await rs.json();
          //console.log('tmogg api data', data);
          const units = data.units || {};
          let effectCount = 0;
          let ownedCountsChanged = false;
          for(const[tmoId, characterId] of TMO_TRANSFER_DATA.entries()){
            const characterRecord = indices.byCharacterId.get(characterId);
            if(!characterRecord){
              continue;
            }
            const tmoCount = units[tmoId] || 0;
            if(characterRecord.level == 1 || characterRecord.level == 2){
              const current = ownedCountState[characterRecord.level].get(characterId) || 0;
              if(current == tmoCount){
                continue; // 如果數量沒有變化，跳過更新
              }
              effectCount++;
              ownedCountsChanged = true;
              //console.log(`Updating character ${characterId} (level ${characterRecord.level}) count from ${current} to ${tmoCount}`);
              if (tmoCount === 0) {
                ownedCountState[characterRecord.level].delete(characterId);
              } else {
                ownedCountState[characterRecord.level].set(characterId, tmoCount);
              }
            }else{
              if (ownedSelector) {
                  effectCount += setTomItemCount(ownedSelector, characterId, tmoCount);
                }
            }
          }
          if(effectCount > 0){
            scheduleRecommendationsRender({ renderOwnedControls: ownedCountsChanged });
            //console.log(`tmogg api data updated, effectCount: ${effectCount}`);
          }
          //console.log('tmogg api data', data);
        }else{
          if(tmoConnectStatus){
            tmoConnectStatus.textContent = i18n.t('tmo.connect_failed');
            tmoFailedCount++;
          }
        }
      }
      catch (e) {
        console.error(e);
        if(tmoConnectStatus){
          tmoConnectStatus.textContent = i18n.t('tmo.connect_failed');
          tmoFailedCount++;
        }       
      }
      finally {
        // 清除已完成的 controller 參照
        activeFetchController = null;
        if(tmoFailedCount >= 5){
          tmoFailedCount = 0;
          tmoToggle.checked = false;
          if(tmoConnectStatus){
            tmoConnectStatus.textContent = i18n.t('tmo.stop_by_failed_5_times');
          }
        }
        // 檢查是否需要提示使用者授權
        if(tmoFailedCount > 0){
          const hasPermission = tmoProxyIpInput.value ? await checkSitePermission('local-network') : await checkSitePermission('loopback-network');
          if(!hasPermission){
            tmoConnectStatus.textContent += `(${i18n.t('tmo.please_grant_permission')})`;
          }
        }
        // 3. 只要開關還是勾選的，無論 catch 抓到什麼錯，無條件排下一次！
        if (tmoToggle.checked) {
          tmoTimerId = setTimeout(pollTmoData, 2200);
        }
      }
    }
    tmoToggle.addEventListener('change', function() {
      tmoFailedCount = 0;
      if (this.checked) {
        // 開啟時：如果有殘留的 timer 先清掉，並延遲啟動
        if (tmoTimerId) clearTimeout(tmoTimerId);
        tmoTimerId = setTimeout(pollTmoData, 500); // 稍微縮短回應體感
      } else {
        // 關閉時：1. 清除 Timer
        if (tmoTimerId) {
          clearTimeout(tmoTimerId);
          tmoTimerId = null;
        }
        // 2. 強制中斷正在進行中的 fetch (讓舊的 pollTmoData 立刻進到 catch/finally 結束)
        if (activeFetchController) {
          activeFetchController.abort();
          activeFetchController = null;
        }
        if (tmoConnectStatus) tmoConnectStatus.textContent = '';
      }
    });
    async function checkSitePermission(permissionName) {
      try{
        const result = await navigator.permissions.query({ name: permissionName });
        if(result.state !== 'granted'){
          return false;
        }
      }catch(e){
        console.error(`Error checking permission for ${permissionName}:`, e);
        return false;
      }
      return true;
    }
    //timger tmogg api end
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
    //
    const recommendClearPinnedBtn = document.getElementById('recommendClearPinnedBtn');
    if(recommendClearPinnedBtn){
      recommendClearPinnedBtn.addEventListener('click', () => {
        clearPinnedCharacters();
        scheduleRecommendationsRender();
      })
    }
  }

if (typeof window !== 'undefined' && window.ORDApp) {
  window.ORDApp.initRecommendPage = initRecommendPage;
}

/**
 * 調整特定項目在 Tom Select 中的數量
 * @param {Object} tomSelectInstance - Tom Select 的實例
 * @param {string} value - 欲調整項目的 value (例如 'apple')
 * @param {number} targetCount - 希望變更到的目標數量 (例如 5 或 3)
 */
function setTomItemCount(tomSelectInstance, value, targetCount) {
  let effectCount = 0;
  // 1. 計算目前這個 value 已經出現了幾次
  const currentItems = tomSelectInstance.getValue();
  const currentCount = currentItems.filter(item => item === value)?.length;

  // 2. 比較數量，多退少補
  if (targetCount > currentCount) {
    // 數量不夠：補上差額
    const diff = targetCount - currentCount;
    for (let i = 0; i < diff; i++) {
      tomSelectInstance.addItem(value, true);
      effectCount++;
    }
  } else if (targetCount < currentCount) {
    // 數量太多：刪除多餘的差額 (removeItem 一次會刪除一個)
    const diff = currentCount - targetCount;
    for (let i = 0; i < diff; i++) {
      tomSelectInstance.removeItem(value, true);
      effectCount++;
    }
  }
  return effectCount;
}
//window.setTomItemCount = setTomItemCount;

//get&set pinned characters with localStorage
function getPinnedCharacters() {
  const pinned = localStorage.getItem('pinnedCharacters');
  return pinned ? JSON.parse(pinned) : [];
}
function togglePinnedCharacter(characterId) {
  const pinned = getPinnedCharacters();
  const index = pinned.indexOf(characterId);
  if (index === -1) {
    pinned.push(characterId);
  } else {
    pinned.splice(index, 1);
  }
  localStorage.setItem('pinnedCharacters', JSON.stringify(pinned));
  return index === -1; // 返回 true 表示已釘選，false 表示已取消釘選
}
function clearPinnedCharacters(){
  localStorage.removeItem('pinnedCharacters');
}
//
function buildPinnedCharactersHtml(records){
  const pinnedCharacters = getPinnedCharacters();
  //build span with level color and display name
  return pinnedCharacters
    .map((characterId) => {
      const record = records.find((r) => r.character_id === characterId);
      if (!record) return '';
      return `<span class="text-lv-${record.level}" title="${escapeHtml(getDisplayName(record))}">${escapeHtml(getDisplayName(record))}</span>`;
    })
    .join(' | ');
}

export default initRecommendPage;
