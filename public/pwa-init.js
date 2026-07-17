const isLocalhost = ['localhost', '127.0.0.1', '[::1]'].includes(location.hostname);
const enableSWOnLocalhost = false; // 開發時設為 true，方便你在本機測試更新功能

if ('serviceWorker' in navigator && (!isLocalhost || enableSWOnLocalhost)) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => {
        console.log('SW 註冊成功');

        // 💡 用一個 flag 鎖住，確保同一時間只會跳出一個更新視窗
        let hasPrompted = false;

        const handleUpdate = (worker) => {
          if (hasPrompted || !worker) return;
          hasPrompted = true;

          // 延遲一下下，避免跟頁面初始載入搶資源
          setTimeout(() => {
            if (confirm('網站已發布新版本，是否立即更新？\r\nNew version available. Update now?')) {
              worker.postMessage({ type: 'SKIP_WAITING' });
            } else {
              // 如果使用者點擊取消，釋放鎖定，下次有新更新時才能再次提示
              hasPrompted = false; 
            }
          }, 1000);
        };

        // 情況 A：頁面一載入，就發現有上一次下載好、正在等待 (waiting) 的新 SW
        if (reg.waiting) {
          handleUpdate(reg.waiting);
        }

        // 情況 B：頁面開啟後，SW 在背景偵測到更新並下載完成 (installing -> installed)
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;
          if (!newWorker) return;

          newWorker.addEventListener('statechange', () => {
            // 只有當新 SW 安裝完成 (installed)，且當前頁面本來就有舊 SW 在控制時，才提示更新
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              handleUpdate(newWorker);
            }
          });
        });
      })
      .catch(err => console.error('SW 註冊失敗', err));
  });

  // 💡 關鍵：只有當使用者點了「確認」，SW 執行 skipWaiting 導致控制權移交 (controllerchange) 時，才重整網頁
  let refreshing = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (refreshing) return;
    // 2. 檢查 sessionStorage，如果這個標記存在，代表我們「剛剛才因為更新而重整過」
    // 藉此阻擋 iOS Safari 重整後又立刻觸發第二次 controllerchange 的 Bug
    if (sessionStorage.getItem('sw_refreshed')) {
      // 拿掉標記，讓下次「真的有新更新」時還能正常重整
      sessionStorage.removeItem('sw_refreshed');
      return;
    }

    refreshing = true;
    
    // 3. 在重整前，存入一個暫時性的標記（分頁關閉就會消失）
    sessionStorage.setItem('sw_refreshed', 'true');
    window.location.reload();
  });
}