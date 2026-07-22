const CACHE_NAME = 'v=260720001'; 

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/resource/192x192.png',
  '/resource/512x512.png',
  '/css/tom-select.css',
  '/js/tom-select.complete.min.js',
  '/js/tex-chtml-nofont.min.js',
];

const DYNAMIC_ASSETS = [/* AUTO_GENERATED_ASSETS */]; // Vite build 後自動注入

const ASSETS_TO_CACHE = [...new Set([...STATIC_ASSETS, ...DYNAMIC_ASSETS])];

// 1. 安裝階段：快取靜態資源
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('正在快取靜態資源...');
      const cachePromises = ASSETS_TO_CACHE.map(url => {
        const request = new Request(url, { cache: 'reload' }); 
        return fetch(request)
          .then(response => {
            if (!response.ok) throw new TypeError(`下載失敗: ${url}`);
            return cache.put(url, response); 
          })
          .catch(err => console.error(`無法快取資源: ${url}`, err));
      });
      return Promise.all(cachePromises);
    })
  );
});

// 2. 激活階段：清理舊快取
self.addEventListener('activate', event => {
  // 💡 這裡千萬「不要」寫 self.clients.claim()
  // 這樣才能保證新 SW 不會主動、默默地去搶控制權，而是乖乖等待 SKIP_WAITING 的指令
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('刪除舊快取:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// 3. 攔截請求 (Network First for HTML, Cache First for others)
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    return; 
  }
  // 檢查是否為內網 IP 請求 (192.168.x.x, 10.x.x.x, 172.16-31.x.x)
  const isPrivateIp = /^(192\.168\.|10\.|172\.(1[6-9]|2[0-9]|3[0-1])\.)/.test(url.hostname);
  if (isPrivateIp) {
    // 獨立處理內網 API，補回 targetAddressSpace 並直接向網絡請求，完全不做快取
    event.respondWith(
      (async () => {
        const requestInit = {
          method: event.request.method,
          headers: event.request.headers,
          mode: event.request.mode,
          credentials: event.request.credentials,
          cache: 'no-store',
          redirect: event.request.redirect,
          referrer: event.request.referrer,
          targetAddressSpace: 'private' // 強制補回私人網路宣告
        };

        if (['POST', 'PUT', 'PATCH'].includes(event.request.method)) {
          requestInit.body = await event.request.clone().arrayBuffer();
        }

        return fetch(event.request.url, requestInit);
      })()
    );
    return;
  }
  const isHtmlRequest = event.request.mode === 'navigate' || 
                        url.pathname.endsWith('.html') || 
                        ASSETS_TO_CACHE.includes(url.pathname);

  if (isHtmlRequest) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(url.pathname, copy);
            });
          }
          return response;
        })
        .catch(() => {
          return caches.match(url.pathname).then(fallbackResponse => {
            return fallbackResponse || caches.match('/index.html') || caches.match('/');
          });
        })
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) {
        return cachedResponse; 
      }
      return fetch(event.request).then(response => {
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseToCache);
        });
        return response;
      });
    })
  );
});

// 4. 監聽前端發送的 SKIP_WAITING 指令
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});