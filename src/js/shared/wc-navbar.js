import { ORDI18n } from './../i18n.js';

class MyNavbar extends HTMLElement {
  constructor() {
    super();
    this._unsubscribeLang = null;
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
    const t = i18n && typeof i18n.t === 'function' ? i18n.t : (key) => key;
    const currentLang = i18n ? i18n.getLang() : 'zh';

    this.innerHTML = `
<style>
/* 預設：桌機版佈局 */
.nav-tabs {
    display: flex;
    align-items: center;
    flex-wrap: wrap; /* 桌機版放不下時自然折行，或者你可以拔掉它讓它自然延伸 */
    gap: 28px;       /* 桌機版給予較寬鬆的間距 */
    border-bottom: 1px solid var(--border-color, rgba(255, 255, 255, 0.1));
    padding: 0 24px;
    background: rgba(15, 23, 42, 0.6);
    backdrop-filter: blur(8px);
}

/* 導覽連結基本樣式（文字感、底線提示） */
.nav-link {
    display: inline-block;
    padding: 18px 0; /* 桌機版上下撐開，左右靠 gap 決定，比較俐落 */
    color: var(--text-muted, #94a3b8);
    font-weight: 500;
    font-size: 1rem;
    text-decoration: none;
    position: relative;
    transition: color 0.2s ease;
}

.nav-link:hover {
    color: var(--text-color, #f8fafc);
}

.nav-link.active {
    color: #ffd28a;
    font-weight: 600;
}

.nav-link.active::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    width: 100%;
    height: 2px;
    background: #ffd28a;
    border-radius: 2px;
}

/* 語系切換：桌機版自動推到最右邊 */
.lang-toggle {
    margin-left: auto; 
    background: none;
    border: none;
    padding: 18px 0;
    color: var(--text-muted, #94a3b8);
    font-weight: 500;
    font-size: 0.95rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 4px;
    transition: color 0.2s ease;
}

.lang-toggle span {
    font-size: 1.1rem;
}

/* ======================================================== */
/* 手機與平板行動端（螢幕寬度小於 768px）才啟動橫向滑動 */
/* ======================================================== */
@media (max-width: 767px) {
    .nav-tabs {
        flex-wrap: nowrap; /* 強迫不換行，走滑動機制 */
        overflow-x: auto;
        white-space: nowrap;
        -webkit-overflow-scrolling: touch;
        gap: 20px;
        padding: 0 16px;
        
        /* 手機版特有的漸層遮罩 */
        mask-image: linear-gradient(to right, black 85%, transparent 100%);
        -webkit-mask-image: linear-gradient(to right, black 85%, transparent 100%);
    }

    /* 隱藏手機版的滾動條 */
    .nav-tabs::-webkit-scrollbar {
        display: none;
    }

    .nav-link, .lang-toggle {
        padding: 14px 2px;
        font-size: 0.9rem;
        flex-shrink: 0; /* 防止元件被壓縮變形 */
    }

    /* 手機版語系按鈕不再強行推到最右邊，而是跟著分頁一起排在後面可供滑動 */
    .lang-toggle {
        margin-left: 0; 
    }
}
</style>
<nav class="nav-tabs" aria-label="主要導覽">
    <a class="nav-link" data-page="lookup" href="index.html">${t('nav.lookup')}</a>
    <a class="nav-link" data-page="tree" href="tree.html">${t('nav.tree')}</a>
    <a class="nav-link" data-page="comp" href="comp.html">${t('nav.comp')}</a>
    <a class="nav-link" data-page="comp_tree" href="comp_tree.html">${t('nav.comp_tree')}</a>
    <a class="nav-link" data-page="recommend" href="recommend.html">${t('nav.recommend')}</a>
    <a class="nav-link" style="display: none;" data-page="maintenance" href="maintenance.html">${t('nav.maintenance')}</a>
    <a class="nav-link" data-page="about" href="about.html">${t('nav.about')}</a>
    <a href="#" class="nav-link lang-toggle" data-action="toggle-lang" aria-label="Switch language">
        <span>🌐</span>${currentLang === 'zh' ? t('lang.en') : t('lang.zh')}
    </a>
</nav>
    `;
  }
}

window.customElements.define('my-navbar', MyNavbar);