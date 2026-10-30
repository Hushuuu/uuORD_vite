import { getSkills } from '../shared/skill-description.js';

const actionIcon = (paths) => `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${paths}</svg>`;
const ACTION_ICONS = {
  upward: actionIcon('<path d="M12 20v-7M5 10V5h14v5M5 5v-2M19 5V3M12 13V5"/><path d="m9 16 3-3 3 3"/>'),
  skills: actionIcon('<path d="M12 6c-3-2-6-2-9-1v14c3-1 6-1 9 1 3-2 6-2 9-1V5c-3-1-6-1-9 1Z"/><path d="M12 6v14M6 9h3M6 12h3M15 9h3M15 12h3"/>'),
  pin: actionIcon('<path d="M9 3h6M9 3v6l-3 3v3h12v-3l-3-3V3M12 15v7"/>'),
  dismiss: actionIcon('<path d="m6 6 12 12M18 6 6 18"/>')
};

function renderRecommendationActions(record, indices, getDisplayName, escapeHtml, translate, isPinned, canDismiss) {
  const action = (data, label, icon, extra = '') => `<button type="button" class="recommend-card-action ${data === 'pinned-character' ? 'pinned-character-btn' : ''}" data-${data}="${escapeHtml(record.character_id)}" aria-label="${escapeHtml(label)}" title="${escapeHtml(label)}" ${extra}>${icon}</button>`;
  return `<div class="recommend-card-actions">
    ${renderUpwardCharacterAction(record, indices, getDisplayName, escapeHtml, translate)}
    ${getSkills(record).length ? action('view-skills', translate('recommend.actions.skills'), ACTION_ICONS.skills, 'aria-haspopup="dialog"') : ''}
    ${action('pinned-character', translate(isPinned ? 'recommend.actions.unpin' : 'recommend.actions.pin'), ACTION_ICONS.pin, `aria-pressed="${Boolean(isPinned)}"`)}
    ${canDismiss ? action('dismiss-character', translate('recommend.actions.dismiss'), ACTION_ICONS.dismiss) : ''}
  </div>`;
}

// 顯示推薦角色的直接材料，並標示已擁有的材料。
function renderMaterialPreview(record, inventory, indices, getDisplayName, escapeHtml) {
  const materials = record.materials || [];
  if (!materials.length) return '<span class="muted">無</span>';

  return materials.map((material) => {
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
  }).join('');
}

// 產生推薦角色的上層角色 tooltip；沒有上層角色時不產生控制項。
function renderUpwardCharacterAction(record, indices, getDisplayName, escapeHtml, translate) {
  const parentRecords = [
    ...new Map(
      (indices.parentMap.get(record.character_id) || [])
        .map((parent) => [parent.character_id, parent])
    ).values(),
  ];
  if (parentRecords.length === 0) {
    return '';
  }

  const namesMarkup = `
    <ul class="recommend-upward-names">
      ${parentRecords
        .map((parent) => `
          <li>
            <span class="recommend-upward-level-dot badge-${parent.level}" aria-hidden="true"></span>
            <span>${escapeHtml(getDisplayName(parent) || parent.character_id)}</span>
          </li>
        `)
        .join('')}
    </ul>
  `;

  return `
    <div class="recommend-upward-tooltip">
      <button
        type="button"
        class="recommend-card-action recommend-upward-btn"
        aria-label="${escapeHtml(translate('tree.upwardShow'))}"
        title="${escapeHtml(translate('tree.upwardShow'))}"
        aria-describedby="recommend-upward-tooltip-${escapeHtml(record.character_id)}"
      >${ACTION_ICONS.upward}</button>
      <div
        id="recommend-upward-tooltip-${escapeHtml(record.character_id)}"
        class="recommend-upward-list"
        role="tooltip"
      >
        <span class="recommend-upward-list-label">${escapeHtml(translate('tree.upwardLabel'))}</span>
        ${namesMarkup}
      </div>
    </div>
  `;
}

// 遞迴產生可展開的推薦材料合成樹。
function renderMaterialTree(
  record,
  inventory,
  indices,
  getLevelLabel,
  getDisplayName,
  escapeHtml,
  trail = new Set(),
  parentPath = ''
) {
  const materials = record.materials || [];
  if (!materials.length) return '';

  return materials.map((material, index) => {
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
      <strong class="recommend-material-name">
        ${escapeHtml(getDisplayName(childRecord))}
        ${childRecord.key_code ? `(${childRecord.key_code})` : ''}
      </strong>
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
              ${renderMaterialTree(childRecord, inventory, indices, getLevelLabel, getDisplayName, escapeHtml, nextTrail, treeKey)}
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
  }).join('');
}

// 產生用於調整等級 1/2 持有數量的加減卡片。
function renderOwnedCountCard(record, count, level, getDisplayName, escapeHtml) {
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

export {
  renderRecommendationActions,
  renderMaterialPreview,
  renderUpwardCharacterAction,
  renderMaterialTree,
  renderOwnedCountCard,
};
