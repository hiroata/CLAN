// サービスワーカー (service-worker.js)
const CACHE_NAME = 'clan-site-cache-v8944-integrated'; // 統合システム対応でバージョン更新
const STATIC_ASSETS = [
  // メインページと重要ページ
  '/',
  '/index.html',
  '/blog/index.html',
  '/achievement/index.html',
  // 統合システムファイル（新規追加）
  '/css/common-variables.css',
  '/css/common-hamburger.css',
  '/js/common-cache.js',
  '/js/common-lazy-loading.js',
  '/js/common-init.js',
  // 既存のスクリプトとスタイル
  '/js/main.js',
  '/css/style.css',
  '/blog/myblog-style.css',
  // 重要な画像
  '/assets/images/logo.webp',
  '/assets/images/hero-pc.webp',
  '/assets/images/hero-sp.webp',
  // 外部ライブラリ
  'https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://cdn.jsdelivr.net/npm/aos@2.3.4/dist/aos.css',
  'https://cdn.jsdelivr.net/npm/aos@2.3.4/dist/aos.js'
];

// インストール時に静的アセットをキャッシュ
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('静的アセットをキャッシュ中');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// アクティベート時に古いキャッシュを削除
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      console.log('古いキャッシュを削除中:', cacheNames);
      return Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME)
          .map(name => {
            console.log('削除するキャッシュ:', name);
            return caches.delete(name);
          })
      );
    }).then(() => {
      console.log('Service Worker アクティベート完了');
      return self.clients.claim();
    })
  );
});

// キャッシュクリア用のメッセージハンドラー
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then(cacheNames => {
        console.log('手動キャッシュクリア実行');
        return Promise.all(
          cacheNames.map(name => caches.delete(name))
        );
      }).then(() => {
        event.ports[0].postMessage({success: true});
      })
    );
  }
});

// フェッチリクエストの処理
self.addEventListener('fetch', event => {
  // 画像、CSS、JSのみをキャッシュ
  if (event.request.method !== 'GET') return;
  
  const url = new URL(event.request.url);
  
  // 静的アセットのキャッシング（キャッシュファースト）
  if (STATIC_ASSETS.includes(url.pathname) || 
      /\.(js|css|png|jpg|jpeg|webp|svg|gif|woff2?)$/.test(url.pathname)) {
    event.respondWith(
      caches.match(event.request)
        .then(cachedResponse => {
          // キャッシュに存在すればそれを返す
          if (cachedResponse) {
            return cachedResponse;
          }
          
          // ネットワークリクエスト
          return fetch(event.request).then(response => {
            // レスポンスが有効かつGETリクエストの場合のみキャッシュ
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // レスポンスをクローンしてキャッシュに保存（レスポンスは1回しか使用できないため）
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
              
            return response;
          });
        })
    );
  }
});
