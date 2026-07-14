const STORAGE_KEY = 'ord_lang';
const DEFAULT_LANG = 'zh';
const SUPPORTED_LANGS = ['zh', 'en'];

  const LEVEL_LABELS = {
    zh: {
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
    },
    en: {
      0: 'Item',
      1: 'Common',
      2: 'Uncommon',
      3: 'Special',
      4: 'Rare',
      5: 'Legendary',
      6: 'Hidden',
      7: 'Twisted',
      8: 'Changed',
      9: 'Limited',
      10: 'Transcended',
      11: 'Immortal',
      12: 'Eternal',
      16: 'Random',
      18: 'Mystery',
      23: 'Seraph',
    }
  };

  const SKILL_TYPE_LABELS = {
    zh: {
      'stl-1-1': '攻擊提升',
      'stl-1-2': '攻速提升',
      'stl-1-3': '狂暴化',
      'stl-1-4': '魔傷增幅',
      'stl-1-5': '濺射效果',
      'stl-1-6': '爆炸傷害增幅',
      'stl-2-1': '單體-已損失血量',
      'stl-2-2': '單體-總血量',
      'stl-2-3': '單體-當前血量',
      'stl-3-1': '範圍-已損失血量',
      'stl-3-2': '範圍-總血量',
      'stl-3-3': '範圍-當前血量',
      'stl-4-1': '減少魔防',
      'stl-4-2': '減少物防',
      'stl-4-3': '無視防禦',
      'stl-4-4': '破甲(max75)',
      'stl-5-1': '單體暈',
      'stl-5-2': '範圍暈',
      'stl-5-3': '緩速',
      'stl-6-1': '空中移動',
      'stl-6-2': '瞬移',
      'stl-6-3': 'Boss 特化',
      'stl-6-4': '移除單位',
      'stl-7-1': '魔力回復',
      'stl-7-2': '生命回復',
    },
    en: {
      'stl-1-1': 'Atk Boost',
      'stl-1-2': 'Aspd Boost',
      'stl-1-3': 'Berserk',
      'stl-1-4': 'Magic Amp',
      'stl-1-5': 'Splash',
      'stl-1-6': 'Explosion Amp',
      'stl-2-1': 'Single - Lost HP%',
      'stl-2-2': 'Single - Max HP%',
      'stl-2-3': 'Single - Curr HP%',
      'stl-3-1': 'AoE - Lost HP%',
      'stl-3-2': 'AoE - Max HP%',
      'stl-3-3': 'AoE - Curr HP%',
      'stl-4-1': 'MR Down',
      'stl-4-2': 'Armor Down',
      'stl-4-3': 'Defense Ignore',
      'stl-4-4': 'Armor Break (max75)',
      'stl-5-1': 'Single Stun',
      'stl-5-2': 'AoE Stun',
      'stl-5-3': 'Slow',
      'stl-6-1': 'Flying',
      'stl-6-2': 'Teleport',
      'stl-6-3': 'Boss Specialization',
      'stl-6-4': 'Delete Unit',
      'stl-7-1': 'Mana Regen',
      'stl-7-2': 'HP Regen',
    }
  };

  const TRANSLATIONS = {
    zh: {
      'lang.zh': '中',
      'lang.en': 'EN',
      'nav.lookup': '總覽表',
      'nav.tree': '合成樹',
      'nav.comp': '隊伍組成',
      'nav.comp_tree': '我的隊伍',
      'nav.recommend': '合成推薦',
      'nav.maintenance': '資料維護',
      'nav.official': '官網',
      'brand.title': 'ORD 航海王隨機防禦合成表',
      'brand.subtitle': 'ver. 2.305[R] | updated. 2026/07/10',
      'brand.feedback': 'Feedback',
      'page.lookup.title': '角色總覽列表',
      'page.lookup.desc': '搜尋角色 / 素材。名稱可點擊回查，功能按鈕可切到合成樹頁面。',
      'page.tree.title': '角色合成樹',
      'page.comp.title': '自訂隊伍組成',
      'page.comp_tree.title': '我的隊伍',
      'page.recommend.title': '合成推薦',
      'page.maintenance.title': '資料維護',
      'field.rarity': '稀有度',
      'field.search': '搜尋',
      'field.actions': '操作',
      'action.reset': '重置條件',
      'table.rarity': '稀有度',
      'table.name': '名稱',
      'table.materials': '材料',
      'table.key': '金鑰',
      'table.remark': '備註',
      'table.actions': '功能',
      'placeholder.searchCharacter': '',
      'summary.showing': '目前顯示 {count} / {total} 筆資料',
      'empty.noResults': '找不到符合條件的資料。',
      'material.none': '-',
      'key.none': '-',
      'remark.none': '-',
      'action.tree': '合成樹',
      'helper.clickHint': '提示：點角色名或材料可直接把關鍵字帶回搜尋框。',
      'select.allRarity': '全部稀有度',
      'all': '全部',
    },
    en: {
      'lang.zh': '中',
      'lang.en': 'EN',
      'nav.lookup': 'Lookup',
      'nav.tree': 'Craft Tree',
      'nav.comp': 'Team Builder',
      'nav.comp_tree': 'My Teams',
      'nav.recommend': 'Recommend',
      'nav.maintenance': 'Maintenance',
      'nav.official': 'Official',
      'brand.title': 'ORD One Piece Random Defense Recipe',
      'brand.subtitle': 'ver. 2.305[R] | updated. 2026/07/10',
      'brand.feedback': 'Feedback',
      'page.lookup.title': 'Character Lookup',
      'page.lookup.desc': 'Search characters / materials. Click a name to search again, or use the action button to open the craft tree.',
      'page.tree.title': 'Craft Tree',
      'page.comp.title': 'Team Builder',
      'page.comp_tree.title': 'My Teams',
      'page.recommend.title': 'Craft Recommendations',
      'page.maintenance.title': 'Data Maintenance',
      'field.rarity': 'Rarity',
      'field.search': 'Search',
      'field.actions': 'Actions',
      'action.reset': 'Reset Filters',
      'table.rarity': 'Rarity',
      'table.name': 'Name',
      'table.materials': 'Materials',
      'table.key': 'Key',
      'table.remark': 'Note',
      'table.actions': 'Actions',
      'placeholder.searchCharacter': '',
      'summary.showing': 'Showing {count} / {total} records',
      'empty.noResults': 'No matching records found.',
      'material.none': '-',
      'key.none': '-',
      'remark.none': '-',
      'action.tree': 'Craft Tree',
      'helper.clickHint': 'Tip: Click a character or material name to copy its keyword into the search box.',
      'select.allRarity': 'All Rarities',
      'all': 'All',
    }
  };

  const listeners = new Set();
  let currentLang = readStoredLang();

  function readStoredLang() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && SUPPORTED_LANGS.includes(stored)) {
        return stored;
      }
    } catch {
      // localStorage may be unavailable in some contexts.
    }
    return DEFAULT_LANG;
  }

  function writeStoredLang(lang) {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // Ignore storage errors.
    }
  }

  function getLang() {
    return currentLang;
  }

  function setLang(lang) {
    const normalized = SUPPORTED_LANGS.includes(lang) ? lang : DEFAULT_LANG;
    if (normalized === currentLang) {
      return;
    }
    currentLang = normalized;
    writeStoredLang(normalized);
    applyDocumentLang();
    listeners.forEach((callback) => callback(normalized));
  }

  function toggleLang() {
    setLang(currentLang === 'zh' ? 'en' : 'zh');
  }

  function onLangChange(callback) {
    listeners.add(callback);
    return () => listeners.delete(callback);
  }

  function applyDocumentLang() {
    document.documentElement.lang = currentLang === 'zh' ? 'zh-TW' : 'en';
  }

  function t(key, params = {}) {
    const dict = TRANSLATIONS[currentLang] || TRANSLATIONS[DEFAULT_LANG];
    let text = dict[key];
    if (text === undefined) {
      const fallbackDict = TRANSLATIONS[DEFAULT_LANG];
      text = fallbackDict[key];
    }
    if (text === undefined) {
      return key;
    }
    return text.replace(/\{(\w+)\}/g, (_, name) => {
      return params[name] !== undefined ? String(params[name]) : `{${name}}`;
    });
  }

  function getLevelLabel(level) {
    const labels = LEVEL_LABELS[currentLang] || LEVEL_LABELS[DEFAULT_LANG];
    return labels[level] || `Lv.${level}`;
  }

  function getSkillTypeLabel(skillType) {
    const labels = SKILL_TYPE_LABELS[currentLang] || SKILL_TYPE_LABELS[DEFAULT_LANG];
    return labels[skillType] || skillType;
  }

  function getSkillTypeLabels(skillTypes) {
    return (skillTypes || []).map((skillType) => getSkillTypeLabel(skillType));
  }

  function getDisplayName(record) {
    if (!record) {
      return '';
    }
    if (currentLang === 'en' && record.en_name) {
      return record.en_name;
    }
    return record.name || '';
  }

  function getAllRarityLabel() {
    return t('select.allRarity');
  }

  function getAllLabel() {
    return t('all');
  }

  function applyStaticTranslations(root = document) {
    if (!root || !root.querySelectorAll) {
      return;
    }

    root.querySelectorAll('[data-i18n]').forEach((element) => {
      const key = element.dataset.i18n;
      if (key) {
        element.textContent = t(key);
      }
    });

    root.querySelectorAll('[data-i18n-html]').forEach((element) => {
      const key = element.dataset.i18nHtml;
      if (key) {
        element.innerHTML = t(key);
      }
    });

    root.querySelectorAll('[data-i18n-placeholder]').forEach((element) => {
      const key = element.dataset.i18nPlaceholder;
      if (key) {
        element.placeholder = t(key);
      }
    });

    root.querySelectorAll('[data-i18n-title]').forEach((element) => {
      const key = element.dataset.i18nTitle;
      if (key) {
        element.title = t(key);
      }
    });
  }

  function setPageTitle(key) {
    document.title = t(key);
  }

export const ORDI18n = {
  SUPPORTED_LANGS,
  DEFAULT_LANG,
  getLang,
  setLang,
  toggleLang,
  onLangChange,
  t,
  getLevelLabel,
  getSkillTypeLabel,
  getSkillTypeLabels,
  getDisplayName,
  getAllRarityLabel,
  getAllLabel,
  applyStaticTranslations,
  setPageTitle
};

if (typeof window !== 'undefined') {
  window.ORDI18n = ORDI18n;
}

applyDocumentLang();

