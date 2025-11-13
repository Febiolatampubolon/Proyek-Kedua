import { getPendingStories, deletePendingStory } from './idb.js';
import { addStory } from '../data/api.js';

export async function processPendingStories() {
  try {
    const pendings = await getPendingStories();
    for (const p of pendings) {
      try {
        const res = await addStory({ description: p.description, photo: p.photo, lat: p.lat, lon: p.lon });
        if (!res.error) {
          await deletePendingStory(p.id);
        }
      } catch (err) {
        console.warn('Failed to sync pending story', p.id, err);
      }
    }
  } catch (err) {
    console.error('Process pending stories error', err);
  }
}