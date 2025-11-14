// CSS imports
import '../styles/styles.css';

import App from './pages/app';
import CONFIG from './config';

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

  if ('serviceWorker' in navigator) {
    try {
      await navigator.serviceWorker.register('/Proyek-Kedua/sw.js', { scope: '/Proyek-Kedua/' });
    } catch (e) {
      console.error('SW registration failed', e);
    }
  }

  let deferredPrompt = null;
  const installButton = document.createElement('button');
  installButton.id = 'install-button';
  installButton.className = 'btn btn-secondary';
  installButton.textContent = 'Install App';
  installButton.style.display = 'none';
  document.querySelector('.main-header')?.appendChild(installButton);

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    installButton.style.display = 'inline-block';
  });

  installButton.addEventListener('click', async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    if (choice.outcome === 'accepted') {
      installButton.style.display = 'none';
      deferredPrompt = null;
    }
  });

  const notifToggle = document.createElement('button');
  notifToggle.id = 'notif-toggle';
  notifToggle.className = 'btn btn-secondary';
  notifToggle.textContent = 'Aktifkan Notifikasi';
  document.querySelector('.main-header')?.appendChild(notifToggle);

  async function getRegistration() {
    return await navigator.serviceWorker.ready;
  }

  function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  async function subscribeUser() {
    const reg = await getRegistration();
    const existing = await reg.pushManager.getSubscription();
    if (existing) return existing;
    const key = CONFIG.VAPID_PUBLIC_KEY || '';
    if (!key) {
      alert('VAPID public key belum dikonfigurasi.');
      return null;
    }
    const convertedKey = urlBase64ToUint8Array(key);
    const sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: convertedKey });
    try {
      await fetch(`${CONFIG.BASE_URL}/push/subscriptions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sub),
      });
    } catch (e) {
      console.warn('Gagal kirim subscription ke server', e);
    }
    return sub;
  }

  async function unsubscribeUser() {
    const reg = await getRegistration();
    const sub = await reg.pushManager.getSubscription();
    if (!sub) return;
    try {
      await fetch(`${CONFIG.BASE_URL}/push/subscriptions`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(await sub.toJSON()),
      });
    } catch (e) {
      console.warn('Gagal hapus subscription di server', e);
    }
    await sub.unsubscribe();
  }

  async function updateToggleLabel() {
    const reg = await getRegistration();
    const sub = await reg.pushManager.getSubscription();
    notifToggle.textContent = sub ? 'Nonaktifkan Notifikasi' : 'Aktifkan Notifikasi';
  }

  notifToggle.addEventListener('click', async () => {
    const reg = await getRegistration();
    const sub = await reg.pushManager.getSubscription();
    if (sub) {
      await unsubscribeUser();
    } else {
      await subscribeUser();
    }
    await updateToggleLabel();
  });

  if ('serviceWorker' in navigator) {
    updateToggleLabel();
  }
});
