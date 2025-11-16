const BASE_PATH = '/Proyek-Kedua/';
const CACHE_VERSION = 'v1';
const APP_CACHE = `app-shell-${CACHE_VERSION}`;
const DATA_CACHE = `app-data-${CACHE_VERSION}`;

const APP_SHELL_FILES = [
  BASE_PATH,
  BASE_PATH + 'index.html',
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(APP_CACHE).then((cache) => cache.addAll(APP_SHELL_FILES)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== APP_CACHE && k !== DATA_CACHE).map((k) => caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  if (event.request.mode === 'navigate') {
    event.respondWith(caches.match(BASE_PATH + 'index.html').then((cached) => cached || fetch(event.request)));
    return;
  }
  if (url.origin.includes('story-api.dicoding.dev')) {
    event.respondWith(
      caches.open(DATA_CACHE).then(async (cache) => {
        try {
          const response = await fetch(event.request);
          cache.put(event.request, response.clone());
          return response;
        } catch (_) {
          const cached = await cache.match(event.request);
          if (cached) return cached;
          throw _;
        }
      })
    );
    return;
  }
  if (url.pathname.startsWith(BASE_PATH)) {
    event.respondWith(
      caches.open(APP_CACHE).then(async (cache) => {
        const cached = await cache.match(event.request);
        if (cached) return cached;
        try {
          const response = await fetch(event.request);
          cache.put(event.request, response.clone());
          return response;
        } catch (e) {
          return caches.match(BASE_PATH + 'index.html');
        }
      })
    );
  }
});

self.addEventListener('push', (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch (_) {
    data = { title: 'Stories Update', body: 'Ada cerita baru.' };
  }
  const title = data.title || 'Stories Update';
  const options = {
    body: data.body || 'Ada cerita baru.',
    icon: data.icon || BASE_PATH + 'icons/icon-192x192.png',
    badge: data.badge || BASE_PATH + 'icons/icon-72x72.png',
    data: { url: data.url || BASE_PATH + '#/map', id: data.id || null },
    actions: [{ action: 'open', title: 'Lihat' }],
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const target = event.notification.data && event.notification.data.url ? event.notification.data.url : BASE_PATH;
  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === target && 'focus' in client) return client.focus();
      }
      if (self.clients.openWindow) return self.clients.openWindow(target);
    })
  );
});