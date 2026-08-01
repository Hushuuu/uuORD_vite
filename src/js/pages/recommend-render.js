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
  renderMaterialPreview,
  renderMaterialTree,
  renderOwnedCountCard,
};
