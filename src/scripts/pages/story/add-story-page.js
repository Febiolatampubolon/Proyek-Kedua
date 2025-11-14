import { addStory } from '../../data/api.js';
import { addPendingStory, getPendingStories, deletePendingStory } from '../../utils/idb.js';
import CONFIG from '../../config';

export default class AddStoryPage {
  async render() {
    return `
      <section class="add-story-container">
        <div class="add-story-card">
          <h2>Add New Story</h2>
          <form id="add-story-form">
            <div class="form-group">
              <label for="description">Description:</label>
              <textarea id="description" name="description" required aria-describedby="description-error"></textarea>
              <span id="description-error" class="error-message" role="alert"></span>
            </div>
            
            <div class="form-group">
              <label for="photo">Photo:</label>
              <input type="file" id="photo" name="photo" accept="image/*" required aria-describedby="photo-error">
              <span id="photo-error" class="error-message" role="alert"></span>
            </div>
            
            <div class="form-group">
              <label for="lat">Latitude:</label>
              <input type="number" id="lat" name="lat" step="any" required aria-describedby="lat-error">
              <span id="lat-error" class="error-message" role="alert"></span>
            </div>
            
            <div class="form-group">
              <label for="lon">Longitude:</label>
              <input type="number" id="lon" name="lon" step="any" required aria-describedby="lon-error">
              <span id="lon-error" class="error-message" role="alert"></span>
            </div>
            
            <div class="form-group">
              <label>Select Location on Map:</label>
              <div id="map" class="map-view" style="height: 300px;"></div>
              <p>Click on the map to select location coordinates</p>
            </div>
            
            <button type="submit" class="btn btn-primary">Add Story</button>
          </form>
        </div>
      </section>
    `;
  }

  async afterRender() {
    // Load map library
    await this.loadLeaflet();
    
    // Initialize map
    this.initMap();
    
    const addStoryForm = document.getElementById('add-story-form');
    
    if (addStoryForm) {
      addStoryForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Get form values
        const description = document.getElementById('description').value;
        const photo = document.getElementById('photo').files[0];
        const lat = parseFloat(document.getElementById('lat').value);
        const lon = parseFloat(document.getElementById('lon').value);
        
        // Validate inputs
        if (!description || !photo || isNaN(lat) || isNaN(lon)) {
          alert('Please fill all fields correctly');
          return;
        }
        
        // Get token from localStorage
        const token = localStorage.getItem('token');
        if (!token) {
          alert('You need to login first');
          window.location.hash = '#/login';
          return;
        }
        
        try {
          const result = await addStory({ description, photo, lat, lon });
          if (result && result.error) {
            alert(`Error: ${result.message}`);
            return;
          }
          alert('Story added successfully!');
          window.location.hash = '#/map';
        } catch (error) {
          await addPendingStory({ description, photo, lat, lon });
          alert('Kamu sedang offline. Cerita disimpan dan akan dikirim saat online.');
        }
      });
    }

    if ('serviceWorker' in navigator && Notification.permission === 'granted') {
      const reg = await navigator.serviceWorker.ready;
      const existing = await reg.pushManager.getSubscription();
      if (!existing && CONFIG.VAPID_PUBLIC_KEY) {
        const key = CONFIG.VAPID_PUBLIC_KEY;
        const padding = '='.repeat((4 - (key.length % 4)) % 4);
        const base64 = (key + padding).replace(/-/g, '+').replace(/_/g, '/');
        const rawData = atob(base64);
        const outputArray = new Uint8Array(rawData.length);
        for (let i = 0; i < rawData.length; ++i) outputArray[i] = rawData.charCodeAt(i);
        try {
          const sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: outputArray });
          try {
            await fetch(`${CONFIG.BASE_URL}/push/subscriptions`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(sub) });
          } catch (_) {}
        } catch (_) {}
      }
    }

    async function flushQueue() {
      const items = await getPendingStories();
      if (!items || items.length === 0) return;
      for (const item of items) {
        try {
          const result = await addStory({ description: item.description, photo: item.photo, lat: item.lat, lon: item.lon });
          if (!result || result.error) continue;
          await deletePendingStory(item.id);
        } catch (_) {}
      }
    }

    window.addEventListener('online', () => {
      flushQueue();
    });
  }

  loadLeaflet() {
    return new Promise((resolve, reject) => {
      // Check if Leaflet is already loaded
      if (window.L) {
        resolve();
        return;
      }

      // Create link element for Leaflet CSS
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);

      // Create script element for Leaflet JS
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = resolve;
      script.onerror = reject;
      document.body.appendChild(script);
    });
  }

  initMap() {
    // Wait for Leaflet to be loaded
    const checkLeaflet = setInterval(() => {
      if (window.L) {
        clearInterval(checkLeaflet);
        
        // Initialize the map
        const map = L.map('map').setView([0, 0], 2);
        
        // Add tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
        
        // Store map instance
        this.map = map;
        
        // Add click event to get coordinates
        map.on('click', (e) => {
          const latInput = document.getElementById('lat');
          const lonInput = document.getElementById('lon');
          
          if (latInput && lonInput) {
            latInput.value = e.latlng.lat.toFixed(6);
            lonInput.value = e.latlng.lng.toFixed(6);
            
            // Add or update marker
            if (this.marker) {
              this.marker.setLatLng(e.latlng);
            } else {
              this.marker = L.marker(e.latlng, { draggable: true }).addTo(map);
              this.marker.on('dragend', (event) => {
                const position = event.target.getLatLng();
                latInput.value = position.lat.toFixed(6);
                lonInput.value = position.lng.toFixed(6);
              });
            }
          }
        });
      }
    }, 100);
  }
}