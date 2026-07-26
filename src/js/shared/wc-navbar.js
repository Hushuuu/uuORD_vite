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
      // 1. 語系切換
      const langToggle = event.target.closest('[data-action="toggle-lang"]');
      if (langToggle && i18n) {
        event.preventDefault();
        i18n.toggleLang();
        return;
      }

      // 2. 手機版漢堡選單開關
      const hamburgerBtn = event.target.closest('.hamburger-btn');
      if (hamburgerBtn) {
        event.preventDefault();
        const navContainer = this.querySelector('.nav-container');
        hamburgerBtn.classList.toggle('active');
        navContainer.classList.toggle('mobile-open');
        return;
      }

      // 3. 點擊點選連結時，若在手機版則自動收起選單
      const navLink = event.target.closest('.nav-link');
      if (navLink && !navLink.classList.contains('lang-toggle')) {
        this._closeMobileMenu();
      }
    });

    // 點擊選單外部時關閉手機選單
    document.addEventListener('click', (event) => {
      if (!this.contains(event.target)) {
        this._closeMobileMenu();
      }
    });
  }

  disconnectedCallback() {
    if (this._unsubscribeLang) {
      this._unsubscribeLang();
      this._unsubscribeLang = null;
    }
  }

  _closeMobileMenu() {
    const hamburgerBtn = this.querySelector('.hamburger-btn');
    const navContainer = this.querySelector('.nav-container');
    if (hamburgerBtn) hamburgerBtn.classList.remove('active');
    if (navContainer) navContainer.classList.remove('mobile-open');
  }

  _render() {
    const i18n = ORDI18n || window.ORDI18n || null;
    const t = i18n && typeof i18n.t === 'function' ? i18n.t : (key) => key;
    const currentLang = i18n ? i18n.getLang() : 'zh';

    const currentPath = window.location.pathname.split('/').pop() || 'index.html';

    this.innerHTML = `
<style>
:host {
    display: block;
    position: relative;
    z-index: 1000;
}

/* 頂部導覽外殼 */
.navbar-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: rgba(15, 23, 42, 0.95);
    border-bottom: 1px solid var(--border-color, rgba(255, 255, 255, 0.1));
    padding: 0 24px;
    backdrop-filter: blur(8px);
    position: relative;
}

/* 手機版漢堡按鈕（預設隱藏） */
.hamburger-btn {
    display: none;
    background: none;
    border: none;
    color: var(--text-color, #f8fafc);
    font-size: 1.5rem;
    cursor: pointer;
    padding: 14px 0;
    line-height: 1;
    outline: none;
}

/* 導覽連結容器 */
.nav-container {
    display: flex;
    align-items: center;
    gap: 28px;
    width: 100%;
}

/* 導覽連結基本樣式 */
.nav-link {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 18px 0;
    color: var(--text-muted, #94a3b8);
    font-weight: 500;
    font-size: 1rem;
    text-decoration: none;
    position: relative;
    transition: color 0.2s ease;
    white-space: nowrap;
}

.nav-link:hover {
    color: var(--text-color, #f8fafc);
}

.nav-link.active {
    color: #ffd28a;
    font-weight: 600;
}

/* 桌機版底線高亮 */
@media (min-width: 768px) {
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

    .lang-toggle {
        margin-left: auto; /* 桌機版推到最右邊 */
    }
}

/* ================= 手機端漢堡選單 (< 768px) ================= */
@media (max-width: 767px) {
    .hamburger-btn {
        display: block; /* 顯示漢堡圖示 */
        margin-left: auto;
    }

    .nav-container {
        display: none; /* 預設隱藏選單 */
        flex-direction: column;
        align-items: flex-start;
        position: absolute;
        top: 100%;
        left: 0;
        width: 100%;
        background: rgba(15, 23, 42, 0.98);
        border-bottom: 1px solid var(--border-color, rgba(255, 255, 255, 0.1));
        padding: 12px 24px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
        gap: 0;
    }

    /* 點擊漢堡按鈕後展開 */
    .nav-container.mobile-open {
        display: flex;
    }

    .nav-link {
        width: 100%;
        padding: 14px 0;
        font-size: 1.05rem;
        border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }

    .lang-toggle {
        border-bottom: none;
        margin-top: 4px;
    }
}
</style>

<div class="navbar-wrapper">
    <!-- 手機版右側漢堡按鈕 -->
    <button class="hamburger-btn" aria-label="Toggle Navigation">☰</button>

    <nav class="nav-container" aria-label="主要導覽">
        <a class="nav-link ${currentPath === 'index.html' ? 'active' : ''}" data-page="lookup" href="index.html">${t('nav.lookup')}</a>
        <a class="nav-link ${currentPath === 'tree.html' ? 'active' : ''}" data-page="tree" href="tree.html">${t('nav.tree')}</a>
        <a class="nav-link ${currentPath === 'comp.html' ? 'active' : ''}" data-page="comp" href="comp.html">${t('nav.comp')}</a>
        <a class="nav-link ${currentPath === 'comp_tree.html' ? 'active' : ''}" data-page="comp_tree" href="comp_tree.html">${t('nav.comp_tree')}</a>
        <a class="nav-link ${currentPath === 'recommend.html' ? 'active' : ''}" data-page="recommend" href="recommend.html">${t('nav.recommend')}</a>
        <a class="nav-link ${currentPath === 'about.html' ? 'active' : ''}" data-page="about" href="about.html">${t('nav.about')}</a>
        
        <a class="nav-link" style="display: none;" data-page="maintenance" href="maintenance.html">${t('nav.maintenance')}</a>

        <!-- 語系切換 -->
        <a href="#" class="nav-link lang-toggle" data-action="toggle-lang" aria-label="Switch language">
            <span>🌐</span>${currentLang === 'zh' ? t('lang.en') : t('lang.zh')}
        </a>
    </nav>
</div>
    `;
  }
}

window.customElements.define('my-navbar', MyNavbar);