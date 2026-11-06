const pages = [
  ['/', '首頁'], ['/lookup.html', '角色總覽與合成表'], ['/tree.html', '角色合成樹'],
  ['/comp.html', '隊伍組成'], ['/comp_tree.html', '我的隊伍'],
  ['/recommend.html', '合成推薦助手'], ['/navigation.html', '航路資訊'],
  ['/patch-notes.html', '版本更新'], ['/about.html', '關於 ORD']
];

// The custom element replaces these ordinary links when it upgrades.
// Keep links to the site's tools available in the initial HTTP response.
export function renderSeoHtml(html) {
  const navigation = `<nav class="static-nav" aria-label="主要導覽">${pages.map(([url, label]) =>
    `<a href="${url}">${label}</a>`).join('')}</nav>`;
  html = html.replace('<my-navbar></my-navbar>', `<my-navbar>${navigation}</my-navbar>`);

  return html;
}
