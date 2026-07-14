import appShared from './shared/app-shared.js';
import { ORDI18n } from './i18n.js';
import ORD_DATA from './ord_data.js';
import './shared/wc-navbar.js';

const {
  cloneData,
  markActiveNav,
  showMaintenanceNav
} = appShared;

const i18n = ORDI18n;

const PAGE_TITLE_KEYS = {
  lookup: 'page.lookup.title',
  tree: 'page.tree.title',
  comp: 'page.comp.title',
  comp_tree: 'page.comp_tree.title',
  recommend: 'page.recommend.title',
  maintenance: 'page.maintenance.title'
};

const PAGE_MODULES = {
  lookup: () => import('./pages/lookup-page.js'),
  tree: () => import('./pages/tree-page.js'),
  comp: () => import('./pages/comp-page.js'),
  comp_tree: () => import('./pages/comp-page.js').then((module) => ({ default: module.initCompTreePage })),
  recommend: () => import('./pages/recommend-page.js'),
  maintenance: () => import('./pages/maintenance-page.js')
};

function initI18n() {
  if (!i18n) {
    return;
  }

  i18n.applyStaticTranslations();

  const page = document.body.dataset.page;
  const titleKey = PAGE_TITLE_KEYS[page];
  if (titleKey) {
    i18n.setPageTitle(titleKey);
  }
}

function markAppReady() {
  document.documentElement.classList.replace('no-js', 'app-ready');
}

async function initApp() {
  initI18n();
  markActiveNav();

  const records = cloneData(ORD_DATA || []);
  const page = document.body.dataset.page;
  const loadPage = PAGE_MODULES[page];

  if (loadPage) {
    try {
      const module = await loadPage();
      if (typeof module.default === 'function') {
        module.default(records);
      }
    } catch (error) {
      console.error(`Failed to load page module for "${page}":`, error);
    }
  }

  showMaintenanceNav();
  markAppReady();
}

window.addEventListener('DOMContentLoaded', initApp);
