const DB_NAME = 'stories-db';
const DB_VERSION = 1;

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains('stories')) {
        db.createObjectStore('stories', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('queue')) {
        db.createObjectStore('queue', { keyPath: 'id', autoIncrement: true });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function saveStories(list) {
  const db = await openDB();
  const tx = db.transaction('stories', 'readwrite');
  const store = tx.objectStore('stories');
  await new Promise((res, rej) => {
    const clearReq = store.clear();
    clearReq.onsuccess = res;
    clearReq.onerror = () => rej(clearReq.error);
  });
  await Promise.all(
    list.map(
      (item) =>
        new Promise((res, rej) => {
          const r = store.put(item);
          r.onsuccess = res;
          r.onerror = () => rej(r.error);
        })
    )
  );
}

export async function getCachedStories() {
  const db = await openDB();
  const tx = db.transaction('stories', 'readonly');
  const store = tx.objectStore('stories');
  return await new Promise((res, rej) => {
    const r = store.getAll();
    r.onsuccess = () => res(r.result || []);
    r.onerror = () => rej(r.error);
  });
}

export async function addPendingStory(data) {
  const db = await openDB();
  const tx = db.transaction('queue', 'readwrite');
  const store = tx.objectStore('queue');
  return await new Promise((res, rej) => {
    const r = store.add({ ...data, createdAt: Date.now() });
    r.onsuccess = () => res(r.result);
    r.onerror = () => rej(r.error);
  });
}

export async function getPendingStories() {
  const db = await openDB();
  const tx = db.transaction('queue', 'readonly');
  const store = tx.objectStore('queue');
  return await new Promise((res, rej) => {
    const r = store.getAll();
    r.onsuccess = () => res(r.result || []);
    r.onerror = () => rej(r.error);
  });
}

export async function deletePendingStory(id) {
  const db = await openDB();
  const tx = db.transaction('queue', 'readwrite');
  const store = tx.objectStore('queue');
  return await new Promise((res, rej) => {
    const r = store.delete(id);
    r.onsuccess = () => res(true);
    r.onerror = () => rej(r.error);
  });
}