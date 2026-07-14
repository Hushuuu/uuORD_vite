import zh from '../locales/zh.json';
import en from '../locales/en.json';

const STORAGE_KEY = 'ord_lang';
const DEFAULT_LANG = 'zh';
const SUPPORTED_LANGS = ['zh', 'en'];

const TRANSLATIONS = {
  zh: zh.translations,
  en: en.translations
};

const LEVEL_LABELS = {
  zh: zh.levelLabels,
  en: en.levelLabels
};

const SKILL_TYPE_LABELS = {
  zh: zh.skillTypeLabels,
  en: en.skillTypeLabels
};

const listeners = new Set();
let currentLang = readInitialLang();

function readUrlLang() {
  if (typeof window === 'undefined' || !window.location) {
    return '';
  }
  const params = new URLSearchParams(window.location.search);
  const lang = params.get('lang');
  return SUPPORTED_LANGS.includes(lang) ? lang : '';
}

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

function readInitialLang() {
  return readUrlLang() || readStoredLang() || DEFAULT_LANG;
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

function updateUrlLang(lang) {
  if (typeof window === 'undefined' || !window.location) {
    return;
  }
  const url = new URL(window.location.href);
  if (lang === DEFAULT_LANG) {
    url.searchParams.delete('lang');
  } else {
    url.searchParams.set('lang', lang);
  }
  window.history.replaceState({}, '', url);
}

function setLang(lang, options = {}) {
  const normalized = SUPPORTED_LANGS.includes(lang) ? lang : DEFAULT_LANG;
  if (normalized === currentLang) {
    return;
  }
  currentLang = normalized;
  writeStoredLang(normalized);
  applyDocumentLang();
  updateUrlLang(normalized);
  listeners.forEach((callback) => callback(normalized));

  if (options.reload !== false) {
    window.location.reload();
  }
}

function toggleLang(options) {
  setLang(currentLang === 'zh' ? 'en' : 'zh', options);
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

