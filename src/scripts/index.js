// CSS imports
import '../styles/styles.css';

import App from './pages/app';
import { processPendingStories } from './utils/sync.js';

document.addEventListener('DOMContentLoaded', async () => {
  const app = new App({
    content: document.querySelector('#main-content'),
    drawerButton: document.querySelector('#drawer-button'),
    navigationDrawer: document.querySelector('#navigation-drawer'),
  });
  await app.renderPage();

  window.addEventListener('hashchange', async () => {
    await app.renderPage();
  });

  // Service worker registration
  if ('serviceWorker' in navigator) {
    try {
      await navigator.serviceWorker.register('/sw.js');
    } catch (err) {
      console.error('SW registration failed', err);
    }
  }

  // PWA install prompt
  let deferredPrompt = null;
  const installButton = document.getElementById('install-button');
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    if (installButton) installButton.style.display = 'inline-block';
  });
  if (installButton) {
    installButton.addEventListener('click', async () => {
      if (!deferredPrompt) return;
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      deferredPrompt = null;
      installButton.style.display = 'none';
      console.log('Install choice', choice);
    });
  }

  // Offline sync when back online
  window.addEventListener('online', async () => {
    await processPendingStories();
  });

  // Listen to SW messages for background sync tag
  navigator.serviceWorker?.addEventListener('message', async (event) => {
    if (event.data?.type === 'SYNC_PENDING_STORIES') {
      await processPendingStories();
    }
  });
});
