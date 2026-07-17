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
  const updatedElements = [];
  root.querySelectorAll('[data-i18n]').forEach((element) => {
    const key = element.dataset.i18n;
    if (key) {
      element.textContent = t(key);
      updatedElements.push(element);
    }
  });

  root.querySelectorAll('[data-i18n-html]').forEach((element) => {
    const key = element.dataset.i18nHtml;
    if (key) {
      element.innerHTML = t(key);
    }
  });

  root.querySelectorAll('[data-i18n-safe-html]').forEach((element) => {
    const key = element.dataset.i18nSafeHtml;
    if (key) {
      // 取得翻譯文字（同時支援變數帶入，如果有設定 data-i18n-index 之類的變數）
      const index = element.dataset.i18nIndex;
      const translatedText = index !== undefined ? t(key, { index }) : t(key);
      
      renderSafeHtmlIntoElement(element, translatedText);
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

  root.querySelectorAll('[data-i18n-index]').forEach((element) => {
    const key = element.dataset.i18n;
    const index = element.dataset.i18nIndex;
    if (key && index !== undefined) {
      element.textContent = t(key, { index });
    }
  });
  // 3. 如果有更新任何元素，且 MathJax 已載入，則手動觸發渲染
  if (updatedElements.length > 0 && window.MathJax && window.MathJax.typesetPromise) {
    // 告訴 MathJax 重新解析這批被修改的元素
    window.MathJax.typesetPromise(updatedElements)
      .then(() => {
        // 渲染成功後的邏輯（可選）
      })
      .catch((err) => {
        console.error("MathJax v4 typeset failed: ", err);
      });
  }
}


function setPageTitle(key) {
  document.title = t(key);
}

// 新增：安全的標籤插值解析器
function renderSafeHtmlIntoElement(element, text) {
  element.innerHTML = '';

  // 升級正則：同時切開 <bold>, <list>, <li> 標籤
  const parts = text.split(/(<bold>.*?<\/bold>|<list>.*?<\/list>|<li>.*?<\/li>)/g);

  // 用來追蹤目前要把節點加在哪裡（如果有 <list>，<li> 就要加到 <ul> 裡）
  let currentTarget = element;

  parts.forEach((part) => {
    if (part.startsWith('<list>') && part.endsWith('</list>')) {
      // 1. 處理整個清單容器
      const content = part.replace(/<\/?list>/g, '');
      const ulEl = document.createElement('ul');
      
      // 這裡你可以加上你原本的 class 或樣式
      ulEl.className = "list-styled";
      ulEl.style.cssText = "font-size: 0.75rem; color: var(--text-muted);";

      // 遞迴解析 <list> 內部的 <li> 和 <bold>
      renderSafeHtmlIntoElement(ulEl, content);
      element.appendChild(ulEl);

    } else if (part.startsWith('<li>') && part.endsWith('</li>')) {
      // 2. 處理清單項目
      const content = part.replace(/<\/?li>/g, '');
      const liEl = document.createElement('li');
      
      // <li> 裡面可能還有 <bold>，所以一樣遞迴解析它
      renderSafeHtmlIntoElement(liEl, content);
      currentTarget.appendChild(liEl);

    } else if (part.startsWith('<bold>') && part.endsWith('</bold>')) {
      // 3. 處理加粗
      const content = part.replace(/<\/?bold>/g, '');
      const strongEl = document.createElement('strong');
      strongEl.textContent = content;
      currentTarget.appendChild(strongEl);
    } else if (part.startsWith('<em>') && part.endsWith('</em>')) {
      // 4. 處理斜體
      const content = part.replace(/<\/?em>/g, '');
      const emEl = document.createElement('em');
      emEl.textContent = content;
      currentTarget.appendChild(emEl);
    } else if (part) {
      // 4. 一般純文字
      const textNode = document.createTextNode(part);
      currentTarget.appendChild(textNode);
    }
  });
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

