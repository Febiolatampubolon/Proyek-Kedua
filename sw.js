const APP_SHELL_CACHE = 'app-shell-v1';
const DYNAMIC_CACHE = 'dynamic-v1';
const STORIES_CACHE = 'stories-cache-v1';

const APP_SHELL_FILES = [
  '/',
  '/index.html',
  '/scripts/index.js',
  '/styles/styles.css',
  '/favicon.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(APP_SHELL_CACHE).then((cache) => cache.addAll(APP_SHELL_FILES))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((k) => ![APP_SHELL_CACHE, DYNAMIC_CACHE, STORIES_CACHE].includes(k))
          .map((k) => caches.delete(k))
      );
    })
  );
  self.clients.claim();
});

// Runtime caching
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Cache API responses for stories (network-first)
  if (url.origin === 'https://story-api.dicoding.dev' && url.pathname.startsWith('/v1/stories')) {
    event.respondWith(
      fetch(request)
        .then((res) => {
          const resClone = res.clone();
          caches.open(STORIES_CACHE).then((cache) => cache.put(request, resClone));
          return res;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // App shell and same-origin assets: cache-first
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(request).then((cached) => {
        return (
          cached ||
          fetch(request).then((res) => {
            const resClone = res.clone();
            caches.open(DYNAMIC_CACHE).then((cache) => cache.put(request, resClone));
            return res;
          })
        );
      })
    );
  }
});

// Push notifications
self.addEventListener('push', (event) => {
  let data = {};
  if (event.data) {
    try {
      data = event.data.json();
    } catch (_) {
      data = { title: 'New Story', options: { body: event.data.text() } };
    }
  }
  const title = data.title || 'Story berhasil dibuat';
  const options = {
    body: (data.options && data.options.body) || 'Ada story baru!',
    icon: '/favicon.png',
    badge: '/favicon.png',
    actions: [
      { action: 'open-map', title: 'Lihat di Map' },
    ],
    data: data.data || {},
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const action = event.action;
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      const url = action === 'open-map' ? '/#/map' : '/#/';
      for (const client of clientList) {
        if ('focus' in client) {
          client.navigate(url);
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});

// Background sync (optional label)
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-pending-stories') {
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientsList) => {
        for (const client of clientsList) {
          client.postMessage({ type: 'SYNC_PENDING_STORIES' });
        }
      })
    );
  }
});