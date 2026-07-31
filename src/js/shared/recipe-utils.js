import {
  getDisplayName,
} from './data-index-utils.js';

const BASE_MATERIAL_SORT_IDS = ['1-8', '1-5', '1-4', '1-9', '1-3', '1-6', '1-2', '1-7', '1-1'];

// 遞迴拆解合成配方，計算等級 0/1 基礎材料數量。
function getBaseMaterialQuantities(record, indices, counts = new Map(), visited = new Set()) {
  if (!record || visited.has(record.character_id)) {
    return counts;
  }

  visited.add(record.character_id);
  if (record.level === 0 || record.level === 1) {
    counts.set(record.character_id, (counts.get(record.character_id) || 0) + 1);
    visited.delete(record.character_id);
    return counts;
  }

  (record.materials || []).forEach((material) => {
    const childRecord = indices.byCharacterId.get(material.material_id);
    if (childRecord) {
      getBaseMaterialQuantities(childRecord, indices, counts, visited);
    } else {
      counts.set(material.material_id, (counts.get(material.material_id) || 0) + 1);
    }
  });

  visited.delete(record.character_id);
  return counts;
}

// 將配方的基礎材料數量格式化成簡潔文字。
function formatBaseMaterialsText(record, indices) {
  const countsMap = getBaseMaterialQuantities(record, indices);
  if (countsMap.size === 0) {
    return '無基礎材料';
  }

  const sortedCounts = Array.from(countsMap).sort((left, right) => {
    let leftIndex = BASE_MATERIAL_SORT_IDS.indexOf(left[0]);
    let rightIndex = BASE_MATERIAL_SORT_IDS.indexOf(right[0]);
    if (leftIndex === -1) leftIndex = Infinity;
    if (rightIndex === -1) rightIndex = Infinity;
    return leftIndex - rightIndex;
  });

  return sortedCounts
    .map(([characterId, count]) => {
      const recordForName = indices.byCharacterId.get(characterId);
      const name = recordForName ? getDisplayName(recordForName) : characterId;
      return `${name} * ${count}`;
    })
    .join(' + ');
}

// 彙總隊伍中所有角色需要的基礎材料。
function getTeamMaterialGroups(selectedTeamIds, indices) {
  const totalCounts = new Map();
  selectedTeamIds.forEach((characterId) => {
    const record = indices.byCharacterId.get(characterId);
    if (record) {
      getBaseMaterialQuantities(record, indices, totalCounts);
    }
  });

  const level0Items = [];
  const level1Items = [];
  totalCounts.forEach((count, characterId) => {
    const record = indices.byCharacterId.get(characterId);
    const item = {
      id: characterId,
      name: record ? getDisplayName(record) : characterId,
      count,
      level: record ? record.level : 0,
    };
    if (item.level === 1) level1Items.push(item);
    else if (item.level === 0) level0Items.push(item);
  });

  level1Items.sort((left, right) => {
    let leftIndex = BASE_MATERIAL_SORT_IDS.indexOf(left.id);
    let rightIndex = BASE_MATERIAL_SORT_IDS.indexOf(right.id);
    if (leftIndex === -1) leftIndex = Infinity;
    if (rightIndex === -1) rightIndex = Infinity;
    return leftIndex - rightIndex;
  });
  level0Items.sort((left, right) => left.name.localeCompare(right.name, 'zh-Hant'));

  return { totalCounts, level0Items, level1Items };
}

export {
  getBaseMaterialQuantities,
  formatBaseMaterialsText,
  getTeamMaterialGroups,
};
