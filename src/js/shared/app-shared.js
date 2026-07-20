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
  ["K10h", "3-33"],   // X-德瑞克 / X-Drake
  //lv4
  ["X90h", "4-45"],
  ["Q10h", "4-6"],
  ["120h", "4-26"],
  ["L10h", "4-19"],
  ["L20h", "4-10"],
  ["X10h", "4-32"],
  ["520h", "4-31"],
  ["220h", "4-25"],
  ["Z10h", "4-28"],
  ["Y10h", "4-40"],
  ["H40h", "4-30"],
  ["W10h", "4-5"],
  ["V10h", "4-3"],
  ["U10h", "4-4"],
  ["T10h", "4-23"],
  ["M20h", "4-43"],
  ["S10h", "4-22"],
  ["N10h", "4-8"],
  ["O10h", "4-35"],
  ["L50h", "4-37"],
  ["I20h", "4-17"],
  ["920h", "4-16"],
  ["820h", "4-33"],
  ["720h", "4-15"],
  ["620h", "4-12"],
  ["B20h", "4-21"],
  ["P10h", "4-36"],
  ["020h", "4-41"],
  ["420h", "4-38"],
  ["C20h", "4-39"],
  ["A20h", "4-9"],
  ["G20h", "4-18"],
  ["F20h", "4-24"],
  ["E20h", "4-42"],
  ["K20h", "4-29"],
  ["320h", "4-44"],
  ["D20h", "4-1"],
  ["H20h", "4-11"],
  ["R10h", "4-14"],
  ["J20h", "4-34"],
  ["K50h", "4-27"],
  ["M10h", "4-13"],
  //lv5
  ["A30h", "5-20"],
  ["T20h", "5-23"],
  ["H30h", "5-18"],
  ["630h", "5-34"],
  ["V20h", "5-28"],
  ["830h", "5-26"],
  ["O20h", "5-9"],
  ["S30h", "5-21"],
  ["F30h", "5-6"],
  ["HA0h", "5-15"],
  ["B30h", "5-31"],
  ["MC0h", "5-29"],
  ["U20h", "5-24"],
  ["N20h", "5-5"],
  ["P20h", "5-19"],
  ["Z90h", "5-35"],
  ["330h", "5-4"],
  ["R20h", "5-36"],
  ["C30h", "5-8"],
  ["X20h", "5-33"],
  ["Y20h", "5-33"],
  ["430h", "5-16"],
  ["730h", "5-40"],
  ["240h", "5-12"],
  ["780h", "5-1"],
  ["S20h", "5-22"],
  ["G30h", "5-7"],
  ["I30h", "5-25"],
  ["E30h", "5-11"],
  ["230h", "5-13"],
  ["K30h", "5-10"],
  ["W20h", "5-32"],
  ["Q20h", "5-38"],
  ["Z20h", "5-2"],
  ["530h", "5-39"],
  ["930h", "5-14"],
  ["130h", "5-37"],
  ["030h", "5-3"],
  //lv6
  ["U30h", "6-9"],
  ["Q30h", "6-5"],
  ["R30h", "6-11"],
  ["P30h", "6-7"],
  ["X30h", "6-12"],
  ["L30h", "6-1"],
  ["T30h", "6-18"],
  ["N30h", "6-15"],
  ["340h", "6-17"],
  ["W30h", "6-16"],
  ["M30h", "6-19"],
  ["V30h", "6-100"],
  ["540h", "6-23"],
  ["IC0h", "6-101"],
  ["440h", "6-20"],
  ["J30h", "6-8"],
  ["Z30h", "6-21"],
  ["L70h", "6-3"],
  ["640h", "6-2"],
  ["550h", "6-4"],
  ["840h", "6-102"],
  ["O30h", "6-14"],
  ["140h", "6-22"],
  ["Y30h", "6-6"],
  ["740h", "6-13"],
  //lv8
  ["S50h", "8-1"],
  ["N70h", "8-2"],
  ["W50h", "8-3"],
  ["KC0h", "8-4"],
  ["J70h", "8-5"],
  //lv16
  ["U60h", "16-1"],
  ["V60h", "16-2"],
  ["T60h", "16-13"],
  ["W60h", "16-9"],
  ["X60h", "16-4"],
  ["Y60h", "16-5"],
  ["Z60h", "16-7"],
  ["070h", "16-10"],
  ["170h", "16-12"],
  ["270h", "16-14"],
  ["370h", "16-6"],
  ["K90h", "16-8"],
  ["L90h", "16-11"],
  ["560h", "16-3"],
  //物品
  ["G60h","0-9"],
  ["RANDOM","0-32"],
  ["H00I","0-7"],
  ["700I","0-6"],
  ["Y00I","0-2"],
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


/*
lv4
### 희귀함
* **id:** X90h | **name:** X-드레이크
* **id:** Q10h | **name:** 거프
* **id:** 120h | **name:** 마샬.D.티치
* **id:** L10h | **name:** 도플라밍고
* **id:** L20h | **name:** 트라팔가 로우
* **id:** X10h | **name:** 루피 기어서드
* **id:** 520h | **name:** 류마
* **id:** 220h | **name:** 마르코
* **id:** Z10h | **name:** 마젤란
* **id:** Y10h | **name:** 모몬가
* **id:** H40h | **name:** 미호크
* **id:** W10h | **name:** 바르톨로메오
* **id:** V10h | **name:** 바제스
* **id:** U10h | **name:** 바질 호킨스
* **id:** T10h | **name:** 반 더 데켄
* **id:** M20h | **name:** 베이비 5
* **id:** S10h | **name:** 벤 베크만
* **id:** N10h | **name:** 브룩
* **id:** O10h | **name:** 비비
* **id:** L50h | **name:** 사보
* **id:** I20h | **name:** 상디 디아블잠브
* **id:** 920h | **name:** 샹크스
* **id:** 820h | **name:** 센토마루
* **id:** 720h | **name:** 슈가
* **id:** 620h | **name:** 시류
* **id:** B20h | **name:** 아오키지
* **id:** P10h | **name:** 아카이누
* **id:** 020h | **name:** 오즈
* **id:** 420h | **name:** 와이퍼
* **id:** C20h | **name:** 우솝
* **id:** A20h | **name:** 이완코브
* **id:** G20h | **name:** 제프
* **id:** F20h | **name:** 조로
* **id:** E20h | **name:** 죠즈
* **id:** K20h | **name:** 쵸파 혼 포인트
* **id:** 320h | **name:** 카쿠
* **id:** D20h | **name:** 캡틴 키드
* **id:** H20h | **name:** 크로커다일
* **id:** R10h | **name:** 키자루
* **id:** J20h | **name:** 킨에몬
* **id:** K50h | **name:** 페로나
* **id:** M10h | **name:** 핸콕

lv5
### 전설 [물딜]

* **id:** A30h | **name:** 레일리
* **id:** T20h | **name:** 마르코
* **id:** H30h | **name:** 샬롯 크래커
* **id:** 630h | **name:** 센고쿠
* **id:** V20h | **name:** 스모커
* **id:** 830h | **name:** 시저
* **id:** O20h | **name:** 에이스
* **id:** S30h | **name:** 울티
* **id:** F30h | **name:** 카르가라
* **id:** HA0h | **name:** 킹
* **id:** B30h | **name:** 흰수염
* **id:** MC0h | **name:** 히바리

---

### 전설 [마딜]

* **id:** U20h | **name:** 마샬.D.티치
* **id:** N20h | **name:** 겟코 모리아
* **id:** P20h | **name:** 나미
* **id:** Z90h | **name:** 네코마무시
* **id:** 330h | **name:** 레이쥬
* **id:** R20h | **name:** 로브 루치
* **id:** C30h | **name:** 트라팔가 로우
* **id:** X20h | **name:** 루피 Jet 개틀링
* **id:** Y20h | **name:** 루피 나이트메어
* **id:** 430h | **name:** 상디
* **id:** 730h | **name:** 슈가
* **id:** 240h | **name:** 시노부
* **id:** 780h | **name:** 아마츠키 토키
* **id:** S20h | **name:** 조로
* **id:** G30h | **name:** 징베
* **id:** I30h | **name:** 제파
* **id:** E30h | **name:** 코비
* **id:** 230h | **name:** 핸콕
* **id:** K30h | **name:** Dr. 히루루크

---

### 전설 [스턴]

* **id:** W20h | **name:** 드래곤
* **id:** Q20h | **name:** 라분
* **id:** Z20h | **name:** 바르톨로메오
* **id:** 530h | **name:** 샹크스
* **id:** 930h | **name:** 시키
* **id:** 130h | **name:** 후지토라
* **id:** 030h | **name:** 쿠마

---
lv6

### 해적선

* **id:** U30h | **name:** 레드포스호
* **id:** Q30h | **name:** 모비딕호
* **id:** R30h | **name:** 반 더 데켄
* **id:** P30h | **name:** 발라티에
* **id:** X30h | **name:** 방주맥심
* **id:** L30h | **name:** 써니호

### 히든 [물딜]

* **id:** T30h | **name:** 레베카
* **id:** N30h | **name:** 료쿠규
* **id:** 340h | **name:** 미호크
* **id:** W30h | **name:** 베르고
* **id:** M30h | **name:** 사보
* **id:** V30h | **name:** 코알라
* **id:** 540h | **name:** 킬러
* **id:** IC0h | **name:** 퀸

### 히든 [마딜]

* **id:** 440h | **name:** 류마
* **id:** J30h | **name:** 시류
* **id:** Z30h | **name:** 아카이누
* **id:** L70h | **name:** 캐럿
* **id:** 640h | **name:** 키쿠
* **id:** 550h | **name:** 스튜시
* **id:** 840h | **name:** 페로나

### 히든 [스턴]

* **id:** O30h | **name:** 봉쿠레
* **id:** 140h | **name:** 아오키지
* **id:** Y30h | **name:** 이완코브
* **id:** 740h | **name:** 피셔타이거
---
lv8
### 변화된

* **id:** S50h | **name:** 도플라밍고
* **id:** N70h | **name:** 베이비 5
* **id:** W50h | **name:** 비비
* **id:** KC0h | **name:** 카쿠
* **id:** J70h | **name:** 캐럿

隨機
### 랜덤유닛

* **id:** U60h | **name:** k'
* **id:** V60h | **name:** 나루토 선인모드
* **id:** T60h | **name:** 페이몬
* **id:** W60h | **name:** 요츠바
* **id:** X60h | **name:** 센토 이스즈
* **id:** Y60h | **name:** 카미조 토우마
* **id:** Z60h | **name:** 전투펭귄
* **id:** 070h | **name:** 이사야마 요미
* **id:** 170h | **name:** 쿠로사키 이치고
* **id:** 270h | **name:** 하네카와 츠바사
* **id:** 370h | **name:** 야가미 라이토
* **id:** K90h | **name:** 옌
* **id:** L90h | **name:** 이치의 율자
* **id:** 560h | **name:** 메구밍
*/