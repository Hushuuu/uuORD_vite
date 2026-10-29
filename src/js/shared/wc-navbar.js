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
        hamburgerBtn.setAttribute('aria-expanded', String(hamburgerBtn.classList.contains('active')));
        navContainer.classList.toggle('mobile-open');
        return;
      }

      // 3. 點擊點選連結時，若在手機版則自動收起選單
      const navLink = event.target.closest('a.nav-link');
      if (navLink && !navLink.classList.contains('lang-toggle')) {
        this._closeMobileMenu();
      }
    });

    this.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        const group = event.target.closest('.nav-group');
        this._closeMobileMenu();
        if (group) group.querySelector('summary').focus();
      }
    });

    this.addEventListener('toggle', (event) => {
      if (!event.target.matches('.nav-group[open]')) return;
      this.querySelectorAll('.nav-group[open]').forEach((group) => {
        if (group !== event.target) group.open = false;
      });
    }, true);

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
    if (hamburgerBtn) {
      hamburgerBtn.classList.remove('active');
      hamburgerBtn.setAttribute('aria-expanded', 'false');
    }
    this.querySelectorAll('.nav-group[open]').forEach((group) => { group.open = false; });
    if (navContainer) navContainer.classList.remove('mobile-open');
  }

  _render() {
    const i18n = ORDI18n || window.ORDI18n || null;
    const t = i18n && typeof i18n.t === 'function' ? i18n.t : (key) => key;
    const currentLang = i18n ? i18n.getLang() : 'zh';

    const currentPath = window.location.pathname.split('/').pop() || 'index.html';

    const groups = [
      ['characters', [['lookup', 'lookup.html'], ['tree', 'tree.html']]],
      ['teams', [['comp', 'comp.html'], ['comp_tree', 'comp_tree.html']]],
      ['assistant', [['recommend', 'recommend.html']]],
      ['info', [['navigation', 'navigation.html'], ['patch_notes', 'patch-notes.html'], ['about', 'about.html']]],
    ];
    const groupMarkup = groups.map(([key, links]) => {
      if (key === 'assistant') {
        return `<a class="nav-link ${currentPath === 'recommend.html' ? 'active' : ''}" data-page="recommend" href="recommend.html" ${currentPath === 'recommend.html' ? 'aria-current="page"' : ''}>${t('nav.recommend')}</a>`;
      }
      return `
      <details class="nav-group ${links.some(([, path]) => path === currentPath) ? 'active' : ''}">
        <summary class="nav-link nav-group-label">${t('nav.' + key)}<svg class="nav-chevron" viewBox="0 0 16 16" aria-hidden="true"><path d="m4 6 4 4 4-4" /></svg></summary>
        <div class="nav-submenu">${links.map(([page, path]) => `
          <a class="nav-link ${currentPath === path ? 'active' : ''}" data-page="${page}" href="${path}" ${currentPath === path ? 'aria-current="page"' : ''}>${t('nav.' + page)}</a>
        `).join('')}</div>
      </details>
    `;
    }).join('');

    this.innerHTML = `
<style>
my-navbar {
    display: block;
    position: relative;
    z-index: 1000;
    max-width: 100%;
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
    flex-wrap: wrap;
    align-items: center;
    gap: 0 20px;
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

.nav-group { position: relative; }
.nav-group-label { cursor: pointer; list-style: none; }
.nav-group-label::-webkit-details-marker { display: none; }
.nav-group.active > summary { color: #ffd28a; font-weight: 600; }
.nav-chevron {
    width: 14px;
    height: 14px;
    margin-left: 2px;
    flex-shrink: 0;
    fill: none;
    stroke: currentColor;
    stroke-width: 1.5;
    stroke-linecap: round;
    stroke-linejoin: round;
    opacity: 0.7;
    transition: transform 0.2s ease;
}
.nav-group[open] .nav-chevron { transform: rotate(180deg); }
.nav-submenu {
    position: absolute;
    top: 100%;
    left: 0;
    min-width: 180px;
    padding: 8px;
    border: 1px solid #334155;
    border-radius: 10px;
    background: #0f172a;
    box-shadow: 0 12px 28px rgba(0, 0, 0, 0.35);
}
.nav-submenu .nav-link { display: flex; padding: 12px; border-radius: 6px; }
.nav-submenu .nav-link:hover { background: #1e293b; }
.nav-submenu .nav-link.active::after { display: none; }
my-navbar :focus-visible { outline: 2px solid #ffd28a; outline-offset: 3px; }

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

    .nav-container { box-sizing: border-box; max-height: 80dvh; overflow-y: auto; }
    .nav-group { width: 100%; }
    .nav-group-label { justify-content: space-between; }
    .nav-submenu {
        position: static;
        min-width: 0;
        padding: 0 0 0 16px;
        border: 0;
        box-shadow: none;
        background: transparent;
    }
    .nav-submenu .nav-link { box-sizing: border-box; }

    .lang-toggle {
        border-bottom: none;
        margin-top: 4px;
    }
}
</style>

<div class="navbar-wrapper">
    <button class="hamburger-btn" aria-label="${t('nav.toggle')}" aria-expanded="false">☰</button>

    <nav class="nav-container" aria-label="${t('nav.main')}">
        <a class="nav-link ${currentPath === 'index.html' ? 'active' : ''}" data-page="home" href="index.html">${t('nav.home')}</a>
        ${groupMarkup}

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
