import appShared from './../shared/app-shared.js';
import { ORDI18n } from './../i18n.js';

const {
  createIndices,
  createTomSelectOptions,
  createTomSelectRenderConfig,
  escapeHtml,
  fillLevelSelect,
  formatBaseMaterialsText,
  getLevelLabel,
  getMaterialNames,
  getPrimaryRecord,
  readQueryParam
} = appShared;

const i18n = ORDI18n || (typeof window !== 'undefined' ? window.ORDI18n : null) || null;
const t = i18n && typeof i18n.t === 'function' ? i18n.t : (key) => key;

function initTreePage(records) {
    const indices = createIndices(records);
    const treeSearchSelect = document.getElementById('treeSearchSelect');
    const levelFilter = document.getElementById('treeLevelFilter');
    const loadButton = document.getElementById('loadTreeButton');
    const resetButton = document.getElementById('resetTreeSearchButton');
    const resultTitle = document.getElementById('treeResultTitle');
    const rootSummary = document.getElementById('treeRootSummary');
    const upwardContainer = document.getElementById('upwardContainer');
    const downwardContainer = document.getElementById('downwardContainer');
    const toggleUpwardButton = document.getElementById('toggleUpwardButton');
    const hasTomSelect = typeof window.TomSelect === 'function';
    const treeSelect = hasTomSelect
      ? new window.TomSelect(treeSearchSelect, {
          options: [],
          valueField: 'value',
          labelField: 'label',
          searchField: ['label', 'value', 'kr_name', 'en_name'],
          maxOptions: 400,
          create: false,
          persist: false,
          placeholder: i18n.t('tree.placeholder'),
          render: createTomSelectRenderConfig(),
          dropdownParent: 'body',
        })
      : null;
    let selectedCharacterId = '';

    fillLevelSelect(levelFilter, t('all'));

    function getFilteredTreeRecords() {
      const levelValue = levelFilter.value;
      return indices.records.filter((record) => !levelValue || String(record.level) === levelValue);
    }

    function syncTreeSelectOptions(preferredCharacterId = '') {
      if (!treeSelect) {
        return;
      }

      const options = createTomSelectOptions(getFilteredTreeRecords());
      const hasPreferred = options.some((option) => option.value === preferredCharacterId);
      treeSelect.clear(true);
      treeSelect.clearOptions();
      treeSelect.addOptions(options);
      treeSelect.refreshOptions(false);

      if (hasPreferred) {
        treeSelect.setValue(preferredCharacterId, true);
        selectedCharacterId = preferredCharacterId;
      } else if (selectedCharacterId && options.some((option) => option.value === selectedCharacterId)) {
        treeSelect.setValue(selectedCharacterId, true);
      } else {
        selectedCharacterId = '';
      }
    }

    function resolveRecordFromInput() {
      return selectedCharacterId ? indices.byCharacterId.get(selectedCharacterId) || null : null;
    }

    function renderNodeCard(record, options = {}) {
      const titleMarkup = options.navigateable
        ? `<button type="button" class="tree-node-action" data-navigate-character="${escapeHtml(record.character_id)}">${escapeHtml(i18n.getDisplayName(record))}</button>`
        : `<strong>${escapeHtml(i18n.getDisplayName(record))}</strong>`;

      return `
        <div class="node-card ${record.level === 0 ? 'placeholder' : ''}">
          <div class="node-title">
            <span class="badge badge-${record.level}">${escapeHtml(getLevelLabel(record.level))}</span>
            ${titleMarkup}
            ${record.key_code ? `(${record.key_code})` : ''}
          </div>
          <div class="node-detail">
            <div style="display:none">${escapeHtml(i18n.t("tree.recordIdLabel"))}${escapeHtml(record.character_id)}</div>
            <div>${escapeHtml(i18n.t("tree.materialsLabel"))}${escapeHtml(getMaterialNames(record, indices).join('、') || i18n.t("comp.materials.none"))}</div>
          </div>
        </div>
      `;
    }

    function renderMissingNodeCard(characterId) {
      return `<li><div class="node-card placeholder"><div class="node-title"><strong>${escapeHtml(characterId)}</strong></div><div class="node-detail">${i18n.t("tree.noRecordFound")}</div></div></li>`;
    }

    // 這裡用 trail 記錄當前展開路徑，避免資料互相參照時無限遞迴。
    function renderDownwardBranch(record, trailCharacterIds, depth) {
      const nextTrail = new Set(trailCharacterIds);
      nextTrail.add(record.character_id);
      const materials = record.materials || [];

      if (materials.length === 0) {
        return `<li>${renderNodeCard(record)}</li>`;
      }

      const childrenMarkup = materials
        .map((material) => {
          const childRecord = getPrimaryRecord(material.material_id, indices);
          if (!childRecord) {
            return renderMissingNodeCard(material.material_id);
          }

          if (nextTrail.has(childRecord.character_id)) {
            return `<li>
              ${renderNodeCard(childRecord)}
              <div class="status-line">${i18n.t("tree.cyclicWarning")}</div>
            </li>`;
          }

          return renderDownwardBranch(childRecord, nextTrail, depth + 1);
        })
        .join('');

      return `
        <li>
          <details class="branch-details">
            <summary class="branch-summary">
              ${renderNodeCard(record, { navigateable: true })}
              <span class="branch-toggle-hint">
                <img style="vertical-align: middle" width="25" height="25" src="/resource/arrow_drop_down.svg" alt="${depth === 1 ? i18n.t('tree.clickCollapseOrExpand') : i18n.t('tree.clickCollapseOrExpand')}">
              </span>
            </summary>
            <ul class="tree-list">${childrenMarkup}</ul>
          </details>
        </li>
      `;
    }

    function renderUpwardSection(record) {
      const parents = indices.parentMap.get(record.character_id) || [];

      if (parents.length === 0) {
        toggleUpwardButton.textContent = i18n.t("tree.noUpward");
        toggleUpwardButton.disabled = true;
        upwardContainer.innerHTML = '<div class="empty-state">' + i18n.t('tree.noUpwardEmpty') + '</div>';
        return;
      }

      toggleUpwardButton.disabled = false;
      toggleUpwardButton.textContent = `${i18n.t("tree.upwardCount", {count: parents.length})}`;
      upwardContainer.innerHTML = `
        <div class="upward-card">
          <h3><span>${i18n.t('tree.upwardLabel')}</span></h3>
          <ul class="upward-list">
            ${parents.map((parent) => `<li>${renderNodeCard(parent, { navigateable: true })}</li>`).join('')}
          </ul>
        </div>
      `;
    }

    function renderTree(record) {
      selectedCharacterId = record.character_id;
      resultTitle.textContent = `${escapeHtml(i18n.getDisplayName(record))}${i18n.t("tree.levelSeparator")}${escapeHtml(getLevelLabel(record.level))} | KR: ${escapeHtml(record.kr_name || "")} | EN: ${escapeHtml(record.en_name || "")}`;

      if (treeSelect) {
        syncTreeSelectOptions(record.character_id);
      }

      const directMaterials = record.materials || [];
      downwardContainer.innerHTML = `
        <div class="tree-card">
          <h4>${i18n.t('tree.clickHint')}</h4>
          <div class="node-card ${record.level === 0 ? 'placeholder' : ''}">
            <div class="node-title">
              <span class="badge badge-${record.level}">${escapeHtml(getLevelLabel(record.level))}</span>
              ${escapeHtml(i18n.getDisplayName(record))} ${record.key_code ? `(${record.key_code})` : ''}
            </div>
            <div class="node-detail">
              <div>${escapeHtml(i18n.t("tree.remarkLabel"))}${escapeHtml(record.remark || '')}</div>
              <div>${escapeHtml(i18n.t("tree.totalMaterialsLabel"))}${escapeHtml(formatBaseMaterialsText(record, indices))}</div>
            </div>
          </div>
          ${directMaterials.length === 0
            ? '<div class="empty-state">${i18n.t("tree.noDownwardMaterials")}</div>'
            : `<ul class="tree-list">${directMaterials
                .map((material) => {
                  const childRecord = getPrimaryRecord(material.material_id, indices);
                  if (!childRecord) {
                    return renderMissingNodeCard(material.material_id);
                  }

                  return renderDownwardBranch(childRecord, new Set([record.character_id]), 1);
                })
                .join('')}</ul>`}
        </div>
      `;
      renderUpwardSection(record);
    }

    function clearTreeView(message = '') {
      resultTitle.textContent = message;
      rootSummary.innerHTML = message ? '<div class="empty-state">${i18n.t("tree.inputHint")}</div>' : '';
      toggleUpwardButton.classList.add('is-hidden');
      upwardContainer.innerHTML = '';
      downwardContainer.innerHTML = '';
    }

    function loadTree(record = resolveRecordFromInput()) {
      if (!record) {
        clearTreeView(i18n.t("tree.notFound"));
        return;
      }

      toggleUpwardButton.classList.remove('is-hidden');
      renderTree(record);
    }

    function handleTreeNavigation(event) {
      const target = event.target.closest('[data-navigate-character]');
      if (!target) {
        return;
      }

      const record = indices.byCharacterId.get(target.dataset.navigateCharacter);
      if (!record) {
        return;
      }

      levelFilter.value = String(record.level);
      syncTreeSelectOptions(record.character_id);
      loadTree(record);
      downwardContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function resetTreeFilters() {
      selectedCharacterId = '';
      levelFilter.value = '';
      if (treeSelect) {
        syncTreeSelectOptions();
        treeSelect.clear(true);
      } else {
        treeSearchSelect.value = '';
      }
      clearTreeView('');
    }

    upwardContainer.addEventListener('click', handleTreeNavigation);
    downwardContainer.addEventListener('click', handleTreeNavigation);

    if (treeSelect) {
      treeSelect.on('change', (value) => {
        selectedCharacterId = String(value || '');
      });
    }

    syncTreeSelectOptions();

    const presetCharacterId = readQueryParam('character');
    if (presetCharacterId && indices.byCharacterId.has(presetCharacterId)) {
      const presetRecord = indices.byCharacterId.get(presetCharacterId);
      levelFilter.value = String(presetRecord.level);
      syncTreeSelectOptions(presetRecord.character_id);
      renderTree(presetRecord);
    }

    loadButton.addEventListener('click', () => loadTree());
    resetButton.addEventListener('click', resetTreeFilters);
    toggleUpwardButton.addEventListener('click', () => {
      upwardContainer.classList.toggle('is-hidden');
      toggleUpwardButton.textContent = upwardContainer.classList.contains('is-hidden')
        ? toggleUpwardButton.textContent.replace(i18n.t('tree.upwardHide'), i18n.t('tree.upwardShow'))
        : toggleUpwardButton.textContent.replace(i18n.t('tree.upwardShow'), i18n.t('tree.upwardHide'));
    });
    levelFilter.addEventListener('change', () => {
      const currentRecord = resolveRecordFromInput();
      syncTreeSelectOptions(currentRecord?.character_id || '');
      if (currentRecord && String(currentRecord.level) === levelFilter.value) {
        loadTree(currentRecord);
      } else if (!levelFilter.value && currentRecord) {
        loadTree(currentRecord);
      } else if (selectedCharacterId) {
        loadTree();
      }
    });
  }

if (typeof window !== 'undefined' && window.ORDApp) {
  window.ORDApp.initTreePage = initTreePage;
}

export default initTreePage;

