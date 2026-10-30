// 相容仍引用舊版腳本的 HTML；新頁面由 src/js/pwa-init.js 管理。
// 不提示、不跳過 waiting，也不強制重整使用中的頁面。
if ('serviceWorker' in navigator &&
    !['localhost', '127.0.0.1', '[::1]'].includes(location.hostname)) {
  navigator.serviceWorker.register('/sw.js', { updateViaCache: 'none' })
    .catch((error) => console.error('SW 註冊失敗', error));
}
