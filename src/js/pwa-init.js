// 開發環境停用 SW；正式站背景下載更新，等待舊頁面全部關閉後自然啟用。
async function initPwa() {
  if (!('serviceWorker' in navigator)) return;

  if (import.meta.env.DEV) {
    const registrations = await navigator.serviceWorker.getRegistrations();
    const isProjectWorker = (worker) => worker &&
      new URL(worker.scriptURL).origin === location.origin &&
      new URL(worker.scriptURL).pathname === '/sw.js';
    const controlledByProject = isProjectWorker(navigator.serviceWorker.controller);

    await Promise.all(registrations
      .filter((reg) => [reg.active, reg.waiting, reg.installing].some(isProjectWorker))
      .map((reg) => reg.unregister()));

    // 僅清除本專案既有的版本快取，保留其他應用的快取與使用者資料。
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames
      .filter((name) => /^v(?:=\d+|-\d{12})$/.test(name))
      .map((name) => caches.delete(name)));

    // unregister 不會解除目前文件的控制權，重新載入一次以脫離舊 SW。
    if (controlledByProject) location.reload();
    return;
  }

  await navigator.serviceWorker.register('/sw.js', { updateViaCache: 'none' });
}

initPwa().catch((error) => console.error('PWA 初始化失敗', error));
