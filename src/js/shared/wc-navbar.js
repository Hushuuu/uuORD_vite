import { ORDI18n } from './../i18n.js';

//import globalStyles from '../../css/styles.css' with { type: 'css' };
// 1. 建立一個繼承 HTMLElement 的類別
class MyNavbar extends HTMLElement {
  constructor() {
    super();
    this._unsubscribeLang = null;
// 先不要使用 Shadow DOM
//     // 2. 建立 Shadow DOM 以隔離樣式與結構
//     this.attachShadow({ mode: 'open' });
//     this.shadowRoot.adoptedStyleSheets = [globalStyles];
    
//     // 3. 寫入樣式與 HTML 結構
//     this.shadowRoot.innerHTML = `
// <style>
// .nav-tabs {
//     display: flex;
//     gap: 10px;
//     flex-wrap: wrap;
// }

// .nav-link {
//     padding: 10px 16px;
//     border-radius: 999px;
//     border: 1px solid var(--border-color);
//     background: rgba(255, 255, 255, 0.04);
//     color: var(--text-color);
//     font-weight: 600;
// }

// .nav-link.active {
//     background: rgba(245, 158, 11, 0.18);
//     border-color: rgba(245, 158, 11, 0.45);
//     color: #ffd28a;
// }
// </style>
// <nav class="nav-tabs" aria-label="主要導覽">
//     <a class="nav-link" data-page="lookup" href="index.html">速查列表</a>
//     <a class="nav-link" data-page="tree" href="tree.html">合成樹</a>
//     <a class="nav-link" data-page="comp" href="comp.html">隊伍組成</a>
//     <a class="nav-link" data-page="recommend" href="recommend.html">合成推薦</a>
//     <a class="nav-link" style="display: none;" data-page="maintenance" href="maintenance.html">資料維護</a>
//     <a class="nav-link" target="_blank" href="https://ordsearch.net/mix">官網</a>
// </nav>
//     `;
  }
  connectedCallback() {
    this._render();

    const i18n = ORDI18n || window.ORDI18n || null;
    if (i18n && typeof i18n.onLangChange === 'function') {
      this._unsubscribeLang = i18n.onLangChange(() => {
        this._render();
      });
    }

    this.addEventListener('click', (event) => {
      const toggle = event.target.closest('[data-action="toggle-lang"]');
      if (toggle && i18n) {
        i18n.toggleLang();
      }
    });
  }

  disconnectedCallback() {
    if (this._unsubscribeLang) {
      this._unsubscribeLang();
      this._unsubscribeLang = null;
    }
  }

  _render() {
    const i18n = ORDI18n || window.ORDI18n || null;
    const t = i18n && typeof i18n.t === 'function'
      ? i18n.t
      : (key) => key;
    const currentLang = i18n ? i18n.getLang() : 'zh';

    this.innerHTML = `
<style>
.nav-tabs {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    align-items: center;
}

.nav-link {
    padding: 10px 16px;
    border-radius: 999px;
    border: 1px solid var(--border-color);
    background: rgba(255, 255, 255, 0.04);
    color: var(--text-color);
    font-weight: 600;
}

.nav-link.active {
    background: rgba(245, 158, 11, 0.18);
    border-color: rgba(245, 158, 11, 0.45);
    color: #ffd28a;
}

.lang-toggle {
    padding: 8px 12px;
    border-radius: 999px;
    border: 1px solid var(--border-color);
    background: rgba(255, 255, 255, 0.08);
    color: var(--text-color);
    font-weight: 700;
    cursor: pointer;
    transition: background 0.2s;
}

.lang-toggle:hover {
    background: rgba(255, 255, 255, 0.16);
}
/* 語系按鈕優化 */
.lang-toggle {
    display: inline-flex;
    align-items: center;
    gap: 6px; /* 圖示與文字的間距 */
    padding: 8px 14px;
    border-radius: 999px;
    border: 1px solid rgba(255, 255, 255, 0.15);
    background: rgba(255, 255, 255, 0.06);
    color: #e2e8f0; /* 讓文字亮一點 */
    font-weight: 600;
    font-size: 0.85rem;
    cursor: pointer;
    transition: all 0.2s ease;
}

.lang-toggle:hover {
    background: rgba(255, 255, 255, 0.12);
    border-color: rgba(245, 158, 11, 0.3); /* 微微帶點你主題的橘黃色 */
    color: #ffd28a;
}

/* 確保手機上不會被擠壓變形 */
.lang-toggle {
    flex-shrink: 0;
}
</style>
<nav class="nav-tabs" aria-label="主要導覽">
    <a class="nav-link" data-page="lookup" href="index.html">${t('nav.lookup')}</a>
    <a class="nav-link" data-page="tree" href="tree.html">${t('nav.tree')}</a>
    <a class="nav-link" data-page="comp" href="comp.html">${t('nav.comp')}</a>
    <a class="nav-link" data-page="comp_tree" href="comp_tree.html">${t('nav.comp_tree')}</a>
    <a class="nav-link" data-page="recommend" href="recommend.html">${t('nav.recommend')}</a>
    <a class="nav-link" style="display: none;" data-page="maintenance" href="maintenance.html">${t('nav.maintenance')}</a>
    <a class="nav-link" target="_blank" href="https://ordsearch.net/mix">${t('nav.official')}</a>
    <button type="button" class="lang-toggle" data-action="toggle-lang" aria-label="Switch language">
    <span>🌐</span>${currentLang === 'zh' ? t('lang.en') : t('lang.zh')}
    </button>
</nav>
    `;
  }
}

// 4. 將自訂元素註冊到瀏覽器中 (標籤名稱必須包含連字號 "-")
window.customElements.define('my-navbar', MyNavbar);
