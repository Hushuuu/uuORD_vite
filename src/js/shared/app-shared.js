import { ORDI18n } from './../i18n.js';

/*
## ⚔️ 攻擊與傷害強化

* 전체 공격력 버프 (공증)：全體攻擊力 Buff（增攻）
* 공격속도 버프 (공속)：攻擊速度 Buff（攻速）
* 광폭화 특화 (광폭화)：狂暴化特化（狂暴）
* 마법데미지 증폭 (도킹)：魔法傷害增幅（Docking / 降魔抗增傷）
* 스플래시 데미지 (스플뎀)：濺射傷害 / 擴散傷害（濺射）
* 폭발형 데미지 증폭 (폭발형 증폭)：爆炸型傷害增幅（爆炸增幅）

## 🎯 單體百分比與斬殺傷害

* 단일 적 잃은체력 %데미지 (단일-잃퍼)：單體敵人已損失血量 % 傷害（單體-損血%）
* 단일 적 전체체력 %데미지 (끝딜)：單體敵人總血量 % 傷害（收尾輸出 / 斬殺）
* 단일 적 현재체력 %데미지 (단일)：單體敵人當前血量 % 傷害（單體）

## 💥 範圍百分比傷害

* 범위 적 잃은체력 %데미지 (범퍼-잃퍼)：範圍敵人已損失血量 % 傷害（範圍-損血%）
* 범위 적 전체체력 %데미지 (범퍼-전퍼)：範圍敵人總血量 % 傷害（範圍-總血%）
* 범위 적 현재체력 %데미지 (범퍼-현퍼)：範圍敵人當前血量 % 傷害（範圍-當前%）

## 🛡️ 削弱與穿透效果

* 마법방어력 감소 (마방깍)：減少魔法防禦力（減魔防）
* 방어력 감소 (방깍)：減少防禦力（減防）
* 방어무시 데미지 (방무뎀)：無視防禦傷害（無視防禦）
* 아머브레이크 (암브)：破甲效果（破甲）

## 🛑 控制與異常狀態

* 단일 적 스턴 (단일스턴)：單體敵人暈眩（單體暈）
* 범위스턴 (스턴)：範圍暈眩（暈眩）
* 이동속도 감소 (이감)：減少移動速度（緩速）

## 🗺️ 機動性與特殊機制

* 공중이동 (공중이동)：空中移動（空中移動）
* 순간이동 (순간이동)：瞬間移動 / 閃現（瞬移）
* 보스특화 (보스)：Boss 特化（Boss）
* 유닛삭제 (삭제)：秒殺單位 / 移除單位（秒殺）

## 🧪 恢復與續航

* 마나회복 (마나젠)：魔力回復 / 回魔（回魔）
* 체력회복 (체젠)：生命回復 / 回血（回血）
*/
const app = window.ORDApp || (window.ORDApp = {});

const LEVEL_LABELS = {
  0: '物品',
  1: '常見',
  2: '不凡',
  3: '特別',
  4: '稀有',
  5: '傳說',
  6: '隱藏',
  7: '扭曲',
  8: '變化',
  9: '限制',
  10: '超越',
  11: '不朽',
  12: '永恆',
  16: '隨機',
  18: '神秘',
  23: '熾天使',
  };

const SKILL_TYPE_LABELS = {
  // 攻擊與傷害強化
  'stl-1-1': '攻擊提升',
  'stl-1-2': '攻速提升',
  'stl-1-3': '狂暴化',
  'stl-1-4': '魔傷增幅',
  'stl-1-5': '濺射效果',
  'stl-1-6': '爆炸傷害增幅',
  // 單體百分比與斬殺傷害
  'stl-2-1': '單體-已損失血量',
  'stl-2-2': '單體-總血量',
  'stl-2-3': '單體-當前血量',
  // 範圍百分比傷害
  'stl-3-1': '範圍-已損失血量',
  'stl-3-2': '範圍-總血量',
  'stl-3-3': '範圍-當前血量',
  // 削弱與穿透效果
  'stl-4-1': '減少魔防',
  'stl-4-2': '減少物防',
  'stl-4-3': '無視防禦',
  'stl-4-4': '破甲(max75)',
  // 控制與異常狀態
  'stl-5-1': '單體暈',
  'stl-5-2': '範圍暈',
  'stl-5-3': '緩速',
  // 機動性與特殊機制
  'stl-6-1': '空中移動',
  'stl-6-2': '瞬移',
  'stl-6-3': 'Boss 特化',
  'stl-6-4': '移除單位',
  // 恢復與續航
  'stl-7-1': '魔力回復',
  'stl-7-2': '生命回復',
  // OP標記
  // 'stl-8-1': 'OP主力-物理',
  // 'stl-8-2': 'OP主力-魔法',
  // 'stl-8-3': 'OP輔助-物理',
  // 'stl-8-4': 'OP輔助-控制',
  }
const MAJOR_LABELS = {
};

function cloneData(data) {
  return JSON.parse(JSON.stringify(data || []));
}

function normalizeText(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[·．\.\-–—_]/g, '')
    .replace(/[\s'"]/g, '')
    .replace(/[()（）\[\]【】]/g, '')
    .replace(/[+,，、/]/g, '')
    .trim();
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

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

function getI18n() {
  return ORDI18n || window.ORDI18n || null;
  }

function getLevelLabel(level) {
  const i18n = getI18n();
  if (i18n && typeof i18n.getLevelLabel === 'function') {
    return i18n.getLevelLabel(level);
  }
  return LEVEL_LABELS[level] || `Lv.${level}`;
  }

function getDisplayName(record) {
  const i18n = getI18n();
  if (i18n && typeof i18n.getDisplayName === 'function') {
    return i18n.getDisplayName(record);
  }
  return record ? record.name || '' : '';
  }

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

  return {
    records: sortedRecords,
    byCharacterId,
    byName,
    parentMap
  };
  }

function getPrimaryRecord(characterId, indices) {
  return indices.byCharacterId.get(characterId) || null;
  }

function resolveRecordLabel(characterId, indices) {
  const record = getPrimaryRecord(characterId, indices);
  return record ? getDisplayName(record) : characterId;
  }

function getMaterialNames(record, indices) {
  return (record.materials || []).map((material) => resolveRecordLabel(material.material_id, indices));
  }

function getSkillTypeLabel(skillType) {
  const i18n = getI18n();
  if (i18n && typeof i18n.getSkillTypeLabel === 'function') {
    return i18n.getSkillTypeLabel(skillType);
  }
  return SKILL_TYPE_LABELS[skillType] || skillType;
  }

function getSkillTypeLabels(skillTypes) {
  return (skillTypes || []).map((skillType) => getSkillTypeLabel(skillType));
  }

function createSkillTypeOptions() {
  return Object.entries(SKILL_TYPE_LABELS).map(([value]) => ({ value, label: getSkillTypeLabel(value) }));
  }

function getSearchableText(record, indices) {
  return [
    record.character_id,
    record.name,
    record.kr_name,
    record.en_name,
    record.key_code,
    record.remark,
    record.major,
    getLevelLabel(record.level),
    ...getMaterialNames(record, indices),
    //...(record.skill_types || []), //先不要查技能
    ...getSkillTypeLabels(record.skill_types),
    ...(record.suitable_partners || []).map((partner) => resolveRecordLabel(partner.character_id, indices))
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
  }

function fillLevelSelect(select, includeAllLabel) {
  const levels = Object.entries(LEVEL_LABELS)
    .map(([level]) => ({ level: Number(level) }))
    .sort((left, right) => left.level - right.level);

  select.innerHTML = '';
  if (includeAllLabel) {
    const option = document.createElement('option');
    option.value = '';
    option.textContent = includeAllLabel;
    select.appendChild(option);
  }

  levels.forEach(({ level }) => {
    const option = document.createElement('option');
    option.value = String(level);
    option.textContent = `${level}｜${getLevelLabel(level)}`;
    select.appendChild(option);
  });
}

function markActiveNav() {
  const page = document.body.dataset.page;
  document.querySelectorAll('.nav-link').forEach((link) => {
    link.classList.toggle('active', link.dataset.page === page);
  });
}

function showToast(element, type, message) {
  element.className = `toast ${type}`;
  element.textContent = message;
}

function clearToast(element) {
  element.className = 'toast';
  element.textContent = '';
}

function downloadTextFile(filename, content, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
  }

function readQueryParam(name) {
  return new URLSearchParams(window.location.search).get(name);
  }

function createTomSelectOptions(records) {
  return [...records]
    .sort(compareRecords)
    .map((record) => ({
        value: record.character_id,
        text: getDisplayName(record),
        label: getDisplayName(record),
        levelLabel: getLevelLabel(record.level),
        kr_name: record.kr_name || '',
        en_name: record.en_name || '',
        character_id: record.character_id
    }));
  }

function createTomSelectRenderConfig() {
  return {
    option(data, escape) {
        return `
          <div>
            <div>${escape(data.label || data.text || data.value)}</div>
            <div class="picker-result-meta">${escape(data.character_id || '')}｜${escape(data.levelLabel || '')}${data.kr_name ? `｜KR：${escape(data.kr_name)}` : ''}</div>
          </div>
        `;
    },
    item(data, escape) {
        return `<div>${escape(data.label || data.text || data.value)}</div>`;
    }
  };
  }

  // 遞迴往下拆解，僅把最基礎的素材累加起來，供合成樹與隊伍分析共用。
function getBaseMaterialQuantities(record, indices, counts = new Map(), visited = new Set()) {
  if (!record) {
    return counts;
  }

  if (visited.has(record.character_id)) {
    return counts;
  }
  visited.add(record.character_id);

  if (record.level === 0 || record.level === 1) {
    const currentCount = counts.get(record.character_id) || 0;
    counts.set(record.character_id, currentCount + 1);
    visited.delete(record.character_id);
    return counts;
  }

  (record.materials || []).forEach((material) => {
    const childRecord = indices.byCharacterId.get(material.material_id);
    if (childRecord) {
        getBaseMaterialQuantities(childRecord, indices, counts, visited);
    } else {
        const currentCount = counts.get(material.material_id) || 0;
        counts.set(material.material_id, currentCount + 1);
    }
  });

  visited.delete(record.character_id);
  return counts;
  }

function formatBaseMaterialsText(record, indices) {
  const countsMap = getBaseMaterialQuantities(record, indices);
  if (countsMap.size === 0) {
    return '無基礎材料';
  }
  const customSortId = ['1-8','1-5','1-4','1-9','1-3','1-6','1-2','1-7','1-1'];
  const sortedCounts = Array.from(countsMap).sort((a, b) => {
    let leftIndex = customSortId.indexOf(a[0]);
    let rightIndex = customSortId.indexOf(b[0]);
    if (leftIndex === -1) leftIndex = Infinity;
    if (rightIndex === -1) rightIndex = Infinity;
    return leftIndex - rightIndex;
  });

  const resultSegments = [];
  sortedCounts.forEach(([characterId, count]) => {
    const childRecord = indices.byCharacterId.get(characterId);
    //const name = childRecord ? childRecord.name : characterId;
    const name = childRecord ? getDisplayName(childRecord) : characterId;
    resultSegments.push(`${name} * ${count}`);
  });

  return resultSegments.join(' + ');
}

function readStoredArray(storage, key) {
  try {
    const parsed = JSON.parse(storage.getItem(key) || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeStoredArray(storage, key, values) {
  storage.setItem(key, JSON.stringify(values));
}

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
        level: record ? record.level : 0
    };

    if (item.level === 1) {
        level1Items.push(item);
    } else if (item.level === 0) {
        level0Items.push(item);
    }
  });
  const sortId = ['1-8','1-5','1-4','1-9','1-3','1-6','1-2','1-7','1-1']
  level1Items.sort((left, right) => {
    let leftIndex = sortId.indexOf(left.id);
    let rightIndex = sortId.indexOf(right.id);
    if (leftIndex === -1) leftIndex = Infinity;
    if (rightIndex === -1) rightIndex = Infinity;
    return leftIndex - rightIndex;
  });
  level0Items.sort((left, right) => left.name.localeCompare(right.name, 'zh-Hant'));

  return { totalCounts, level0Items, level1Items };
}

function setCanMaintain(value) {
  localStorage.setItem('canMaintain', value ? 'true' : 'false');
}

function getIfCanMaintain() {
  return localStorage.getItem('canMaintain') === 'true';
}

function showMaintenanceNav() {
  if (!getIfCanMaintain()) {
    return;
  }

  const navLink = document.querySelector('.nav-link[data-page="maintenance"]');
  if (navLink) {
    navLink.style.display = 'block';
  }
}

//begin tmo data
const TMO_TRANSFER_DATA = new Map([
  ["600h", "1-1"],
  ["500h", "1-2"],
  ["400h", "1-3"],
  ["100h", "1-4"],
  ["200h", "1-5"],
  ["800h", "1-6"],
  ["900h", "1-7"],
  ["300h", "1-8"],
  ["700h", "1-9"],
  // LV2
  ["F00h", "2-1"],   // 小八魚人
  ["D00h", "2-2"],   // 布魯克
  ["L00h", "2-3"],   // 佛朗基
  ["O00h", "2-4"],   // 妮可·羅賓
  ["K00h", "2-5"],   // 波特卡斯·D·艾斯
  ["N00h", "2-6"],   // 狙擊王騙人布 / 騙人布狙擊王
  ["I00h", "2-7"],   // 雷電 / 閃電
  ["C00h", "2-8"],   // 培波
  ["J00h", "2-9"],   // 培羅娜 / perona
  ["G00h", "2-10"],  // 喬巴 藍波球強化
  ["E00h", "2-11"],  // 達絲琪 / 達斯琪
  ["M00h", "2-13"],  // CP9 布魯諾
  ["A00h", "2-14"],  // CP9 梟
  // LV3
  ["Y00h", "3-1"],   // 尤斯塔斯·基德 / Kid
  ["610h", "3-2"],   // 巴吉魯·霍金斯
  ["510h", "3-3"],   // 巴其 特製巴其彈
  ["710h", "3-4"],   // 巴索羅繆·大熊
  ["B00h", "3-5"],   // 月光·摩利亞
  ["C10h", "3-6"],   // カ波涅·培基
  ["210h", "3-7"],   // 史庫亞德 大漩渦蜘蛛
  ["810h", "3-8"],   // 吉貝爾 甚平 七武海
  ["H10h", "3-9"],   // 托拉法爾加·羅 / Law
  ["A10h", "3-10"],  // 克洛克達爾 七武海
  ["V00h", "3-11"],  // 克洛船長
  ["S00h", "3-12"],  // 妮可·羅賓 歐哈拉的惡魔
  ["J10h", "3-13"],  // 波特卡斯·D·艾斯 白鬍子海賊團
  ["010h", "3-14"],  // 阿布薩洛姆 隱形果實
  ["910h", "3-15"],  // 洽卡 ア拉巴斯坦守護神
  ["310h", "3-16"],  // 香吉士 黑足 / sanji
  ["P00h", "3-17"],  // 娜美 天候棒
  ["G10h", "3-18"],  // 海賊合體5號 佛朗基 / 海賊合體
  ["Q00h", "3-19"],  // 神·艾涅爾
  ["W00h", "3-20"],  // 索隆 阿修羅
  ["X00h", "3-21"],  // 雷電 革命軍
  ["T00h", "3-22"],  // 馬可
  ["B10h", "3-23"],  // 基拉
  ["D10h", "3-24"],  // 喬巴 皮毛強化
  ["E10h", "3-25"],  // 喬巴 頭腦強化
  ["110h", "3-26"],  // 惡龍
  ["F10h", "3-27"],  // 斯摩格
  ["410h", "3-28"],  // 馮·克雷 Mr.2 / 馮克雷
  ["I10h", "3-29"],  // 赫爾梅波 貝魯梅伯 / 赫魯梅柏
  ["U00h", "3-30"],  // 魯夫二檔
  ["R00h", "3-31"],  // 羅布·路基 CP9 / 羅布路基
  ["Z00h", "3-32"],  // 騙人布 火焰星
  ["K10h", "3-33"]   // X-德瑞克 / X-Drake
]);
//end tmo data

const api = {
  LEVEL_LABELS,
  SKILL_TYPE_LABELS,
  cloneData,
  normalizeText,
  escapeHtml,
  compareRecords,
  getLevelLabel,
  getDisplayName,
  createIndices,
  getPrimaryRecord,
  resolveRecordLabel,
  getMaterialNames,
  getSkillTypeLabel,
  getSkillTypeLabels,
  createSkillTypeOptions,
  getSearchableText,
  fillLevelSelect,
  markActiveNav,
  showToast,
  clearToast,
  downloadTextFile,
  readQueryParam,
  createTomSelectOptions,
  createTomSelectRenderConfig,
  getBaseMaterialQuantities,
  formatBaseMaterialsText,
  readStoredArray,
  writeStoredArray,
  getTeamMaterialGroups,
  setCanMaintain,
  getIfCanMaintain,
  showMaintenanceNav,
  TMO_TRANSFER_DATA
};

Object.assign(app, api);

if (typeof window !== 'undefined') {
  // 保留舊的全域入口，避免既有書籤或手動 console 操作失效。
  window.setCanMaintain = setCanMaintain;
  window.getIfCanMaintain = getIfCanMaintain;
}

export default api;


