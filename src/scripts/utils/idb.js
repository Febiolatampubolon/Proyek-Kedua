const DB_NAME = 'stories-app-db';
const DB_VERSION = 1;

function openDb() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('savedStories')) {
        db.createObjectStore('savedStories', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('pendingStories')) {
        db.createObjectStore('pendingStories', { keyPath: 'id', autoIncrement: true });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveStoryOffline(story) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('savedStories', 'readwrite');
    tx.objectStore('savedStories').put(story);
    tx.oncomplete = () => resolve(true);
    tx.onerror = () => reject(tx.error);
  });
}

export async function getSavedStories() {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('savedStories', 'readonly');
    const req = tx.objectStore('savedStories').getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  });
}

export async function deleteSavedStory(id) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('savedStories', 'readwrite');
    tx.objectStore('savedStories').delete(id);
    tx.oncomplete = () => resolve(true);
    tx.onerror = () => reject(tx.error);
  });
}

export async function savePendingStory(pending) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('pendingStories', 'readwrite');
    const req = tx.objectStore('pendingStories').add(pending);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function getPendingStories() {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('pendingStories', 'readonly');
    const req = tx.objectStore('pendingStories').getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  });
}

export async function deletePendingStory(id) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('pendingStories', 'readwrite');
    tx.objectStore('pendingStories').delete(id);
    tx.oncomplete = () => resolve(true);
    tx.onerror = () => reject(tx.error);
  });
}