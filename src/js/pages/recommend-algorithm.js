// 格式化技能名稱，並附加可選的數值或備註。
function formatSkillLabelsWithValues(skillTypes = [], skillValues = {}, getSkillTypeLabel) {
  return (skillTypes || []).map((skillType) => {
    const label = getSkillTypeLabel(skillType);
    const entry = skillValues?.[skillType];
    if (!entry || (entry.value === null && !(entry.remark || '').trim())) {
      return label;
    }
    const valueText = entry.value === null || entry.value === undefined ? '' : String(entry.value);
    const remarkText = entry.remark ? ` ${entry.remark}` : '';
    return `${label}(${valueText}${remarkText})`;
  });
}

// 根據現有角色資料建立可選的目標稀有度。
function buildTargetLevelOptions(records, getLevelLabel) {
  const levels = [...new Set(records
    .map((record) => Number(record.level))
    .filter((level) => Number.isFinite(level) && level > 2))]
    .sort((left, right) => left - right);

  return levels.map((level) => ({ value: level, label: `${getLevelLabel(level)}` }));
}

// 加總材料數量 Map 中的所有數量。
function countMapTotal(counts) {
  let total = 0;
  counts.forEach((count) => {
    total += count;
  });
  return total;
}

// 將 Tom Select 的單值或多值結果統一轉成陣列。
function normalizeOwnedValues(value) {
  if (Array.isArray(value)) return value;
  if (value === null || value === undefined || value === '') return [];
  return [value];
}

// 合併手動輸入的持有數量與已選取的持有角色。
function createInventoryMap(records, ownedCountsByLevel, selectedOwnedIds) {
  const map = new Map();
  records.forEach((record) => map.set(record.character_id, 0));

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

// 將材料數量格式化成文字。
function formatMaterialCounts(counts, indices, getPrimaryRecord, getDisplayName, emptyText, sortUnknown = false) {
  const sortId = ['1-8', '1-5', '1-4', '1-9', '1-3', '1-6', '1-2', '1-7', '1-1'];
  const segments = [...counts.entries()]
    .filter(([, count]) => count > 0)
    .sort((left, right) => {
      let leftIndex = sortId.indexOf(left[0]);
      let rightIndex = sortId.indexOf(right[0]);
      if (leftIndex === -1) leftIndex = Infinity;
      if (rightIndex === -1) rightIndex = Infinity;
      if (leftIndex !== rightIndex) {
        return leftIndex - rightIndex;
      }
      if (!sortUnknown) {
        return 0;
      }

      const leftRecord = getPrimaryRecord(left[0], indices);
      const rightRecord = getPrimaryRecord(right[0], indices);
      const levelCompare = Number(leftRecord?.level ?? Infinity) - Number(rightRecord?.level ?? Infinity);
      if (levelCompare !== 0) {
        return levelCompare;
      }

      return String(left[0]).localeCompare(String(right[0]), undefined, { numeric: true });
    })
    .map(([materialId, count]) => `${getDisplayName(getPrimaryRecord(materialId, indices)) || materialId}*${count}`);
  return segments.join(' + ') || emptyText;
}

// 將推薦結果中的缺少基礎材料格式化成文字。
function formatRequiredBaseMaterialsFromCounts(counts, indices, getPrimaryRecord, getDisplayName) {
  return formatMaterialCounts(counts, indices, getPrimaryRecord, getDisplayName, '無需額外素材');
}

// 將推薦結果中的超過材料格式化成文字。
function formatExcessMaterialsFromCounts(counts, indices, getPrimaryRecord, getDisplayName) {
  return formatMaterialCounts(counts, indices, getPrimaryRecord, getDisplayName, '無', true);
}

// 建立合成分析器，並重用已快取的材料權重。
function createRecipeAnalyzer(indices) {
  const realWeightCache = new Map();

  function getRealWeight(characterId) {
    if (realWeightCache.has(characterId)) return realWeightCache.get(characterId);
    const record = indices.byCharacterId.get(characterId);
    if (!record) return 1;

    const materials = record.materials || [];
    if (record.level <= 1) {
      realWeightCache.set(characterId, 1);
      return 1;
    }
    if (!materials.length) {
      const weight = Math.floor(4 * record.level);
      realWeightCache.set(characterId, weight);
      return weight;
    }

    const totalWeight = materials.reduce(
      (total, material) => total + getRealWeight(material.material_id),
      0
    );
    realWeightCache.set(characterId, totalWeight);
    return totalWeight;
  }

  // 遞迴計算已擁有進度與缺少的合成階級。
  return function analyzeRecipe(characterId, inventory) {
    const inv = new Map(inventory);
    const rootRecord = indices.byCharacterId.get(characterId);
    if (!rootRecord) {
      return {
        status: { scoreOwned: 0, scoreTotal: 0 },
        missingBaseCounts: new Map(),
        missingTierCounts: new Map(),
        excessCounts: new Map(),
      };
    }

    const result = {
      status: { scoreOwned: 0, scoreTotal: getRealWeight(rootRecord.character_id) },
      missingBaseCounts: new Map(),
      missingTierCounts: new Map(),
      excessCounts: new Map(),
    };
    const visited = new Set();
    const requiredMaterialIds = new Set();

    function collectMaterialIds(record, trail = new Set()) {
      if (!record || trail.has(record.character_id)) return;
      trail.add(record.character_id);

      (record.materials || []).forEach((material) => {
        requiredMaterialIds.add(material.material_id);
        collectMaterialIds(indices.byCharacterId.get(material.material_id), trail);
      });

      trail.delete(record.character_id);
    }

    function traverse(record, isFirstCall = false) {
      if (!record || visited.has(record.character_id)) return;
      visited.add(record.character_id);

      const weight = getRealWeight(record.character_id);
      const available = inv.get(record.character_id) || 0;
      if (available > 0 && !isFirstCall) {
        inv.set(record.character_id, available - 1);
        result.status.scoreOwned += weight;
        visited.delete(record.character_id);
        return;
      }

      if (!isFirstCall) {
        result.missingTierCounts.set(
          record.level,
          (result.missingTierCounts.get(record.level) || 0) + 1
        );
      }

      const materials = record.materials || [];
      if (materials.length === 0 || record.level === 1) {
        result.missingBaseCounts.set(
          record.character_id,
          (result.missingBaseCounts.get(record.character_id) || 0) + 1
        );
      } else {
        materials.forEach((material) => {
          const childRecord = indices.byCharacterId.get(material.material_id);
          if (childRecord) {
            traverse(childRecord);
          } else {
            result.missingBaseCounts.set(
              material.material_id,
              (result.missingBaseCounts.get(material.material_id) || 0) + 1
            );
          }
        });
      }
      visited.delete(record.character_id);
    }

    collectMaterialIds(rootRecord);
    traverse(rootRecord, true);
    requiredMaterialIds.forEach((materialId) => {
      const excessCount = inv.get(materialId) || 0;
      const materialRecord = indices.byCharacterId.get(materialId);
      if (excessCount <= 0 || materialRecord?.level !== 1) {
        return;
      }

      result.excessCounts.set(materialId, excessCount);
    });
    return result;
  };
}

// 從最高優先級階級開始，比較推薦結果的材料缺口。
function compareMissingTierCounts(leftCounts, rightCounts, levelsDesc) {
  for (const level of levelsDesc) {
    const diff = (leftCounts.get(level) || 0) - (rightCounts.get(level) || 0);
    if (diff !== 0) return diff;
  }
  return 0;
}

export {
  formatSkillLabelsWithValues,
  buildTargetLevelOptions,
  countMapTotal,
  normalizeOwnedValues,
  createInventoryMap,
  formatMaterialCounts,
  formatRequiredBaseMaterialsFromCounts,
  formatExcessMaterialsFromCounts,
  createRecipeAnalyzer,
  compareMissingTierCounts,
};
