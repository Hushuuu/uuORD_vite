import { ORDI18n } from './../i18n.js';

// 複製資料集，避免頁面功能直接修改原始資料。
function cloneData(data) {
  return JSON.parse(JSON.stringify(data || []));
}

// 統一名稱與搜尋文字格式，避免標點差異影響比對。
function normalizeText(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[·．\.\-–—_]/g, '')
    .replace(/[\s'"]/g, '')
    .replace(/[()（）\[\]【】]/g, '')
    .replace(/[+,，、/]/g, '')
    .trim();
}

// 將動態值跳脫，避免插入 HTML 字串時產生問題。
function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// 依等級、ID、目前語系名稱排序，確保列表順序穩定。
function compareRecords(left, right) {
  if (left.level !== right.level) {
    return Number(left.level || 0) - Number(right.level || 0);
  }

  const levelCompare = String(left.character_id || '').localeCompare(
    String(right.character_id || ''),
    undefined,
    { numeric: true, sensitivity: 'base' }
  );

  if (levelCompare !== 0) {
    return levelCompare;
  }

  return String(left.name || '').localeCompare(String(right.name || ''), 'zh-Hant');
}

// 取得 i18n 服務，讓此工具在非瀏覽器環境也能安全使用。
function getI18n() {
  return ORDI18n || (typeof window !== 'undefined' ? window.ORDI18n : null) || null;
}

// 取得指定稀有度的多語系名稱。
function getLevelLabel(level) {
  const i18n = getI18n();
  if (i18n && typeof i18n.getLevelLabel === 'function') {
    return i18n.getLevelLabel(level);
  }
  return `Lv.${level}`;
}

// 取得角色顯示名稱；使用英文時優先顯示英文名稱。
function getDisplayName(record) {
  const i18n = getI18n();
  if (i18n && typeof i18n.getDisplayName === 'function') {
    return i18n.getDisplayName(record);
  }
  return record ? record.name || '' : '';
}

// 建立搜尋、合成遞迴與父子關係會使用的索引。
function createIndices(records) {
  const sortedRecords = [...records].sort(compareRecords);
  const byCharacterId = new Map();
  const byName = new Map();
  const parentMap = new Map();

  sortedRecords.forEach((record) => {
    byCharacterId.set(record.character_id, record);

    const normalizedName = normalizeText(record.name);
    if (normalizedName && !byName.has(normalizedName)) {
      byName.set(normalizedName, record);
    }

    (record.materials || []).forEach((material) => {
      const materialId = material.material_id;
      if (!parentMap.has(materialId)) {
        parentMap.set(materialId, []);
      }
      parentMap.get(materialId).push(record);
    });
  });

  return { records: sortedRecords, byCharacterId, byName, parentMap };
}

// 透過固定角色 ID 查找角色資料。
function getPrimaryRecord(characterId, indices) {
  return indices.byCharacterId.get(characterId) || null;
}

// 取得技能類型 ID 的多語系名稱。
function getSkillTypeLabel(skillType) {
  const i18n = getI18n();
  if (i18n && typeof i18n.getSkillTypeLabel === 'function') {
    return i18n.getSkillTypeLabel(skillType);
  }
  return skillType;
}

// 將技能類型 ID 清單轉換成多語系名稱。
function getSkillTypeLabels(skillTypes) {
  return (skillTypes || []).map((skillType) => getSkillTypeLabel(skillType));
}

// 從 i18n 字典產生技能篩選選項。
function createSkillTypeOptions() {
  const i18n = getI18n();
  return i18n && typeof i18n.getSkillTypeOptions === 'function'
    ? i18n.getSkillTypeOptions()
    : [];
}

// 依數字順序產生多語系稀有度選項。
function getLevelOptions() {
  const i18n = getI18n();
  return i18n && typeof i18n.getLevelOptions === 'function'
    ? i18n.getLevelOptions()
    : [];
}

export {
  cloneData,
  normalizeText,
  escapeHtml,
  compareRecords,
  getLevelLabel,
  getDisplayName,
  createIndices,
  getPrimaryRecord,
  getSkillTypeLabel,
  getSkillTypeLabels,
  createSkillTypeOptions,
  getLevelOptions,
};
