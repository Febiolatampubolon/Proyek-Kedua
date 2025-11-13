import { addStory } from '../../data/api.js';

export default class AddStoryPage {
  async render() {
    return `
      <section class="add-story-container">
        <div class="add-story-card">
          <h1>Add New Story</h1>
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
            <div id="submit-status" class="error-message" aria-live="polite"></div>
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
        const descriptionEl = document.getElementById('description');
        const photoEl = document.getElementById('photo');
        const latEl = document.getElementById('lat');
        const lonEl = document.getElementById('lon');
        const statusEl = document.getElementById('submit-status');

        // Reset errors
        ['description','photo','lat','lon'].forEach(id => {
          const err = document.getElementById(`${id}-error`);
          if (err) err.textContent = '';
        });
        statusEl.textContent = '';

        const description = descriptionEl.value.trim();
        const photo = photoEl.files[0];
        const lat = parseFloat(document.getElementById('lat').value);
        const lon = parseFloat(document.getElementById('lon').value);
        
        // Validate inputs
        let hasError = false;
        if (!description) {
          document.getElementById('description-error').textContent = 'Deskripsi wajib diisi';
          hasError = true;
        }
        if (!photo) {
          document.getElementById('photo-error').textContent = 'Foto wajib diunggah';
          hasError = true;
        } else {
          if (!photo.type.startsWith('image/')) {
            document.getElementById('photo-error').textContent = 'File harus berupa gambar';
            hasError = true;
          }
          if (photo.size > 1024 * 1024) {
            document.getElementById('photo-error').textContent = 'Ukuran gambar maksimal 1MB';
            hasError = true;
          }
        }
        if (isNaN(lat)) {
          document.getElementById('lat-error').textContent = 'Pilih lokasi pada peta';
          hasError = true;
        }
        if (isNaN(lon)) {
          document.getElementById('lon-error').textContent = 'Pilih lokasi pada peta';
          hasError = true;
        }
        if (hasError) return;
        
        // Get token from localStorage
        const token = localStorage.getItem('token');
        if (!token) {
          // Allow guest submission but inform user
          statusEl.textContent = 'Mengirim sebagai tamu (tanpa autentikasi).';
        }
        
        try {
          const result = await addStory({ description, photo, lat, lon });
          
          if (result.error) {
            throw new Error(result.message || 'Gagal menambahkan cerita');
          }
          
          // Show success message and redirect to map
          statusEl.textContent = 'Story berhasil ditambahkan!';
          window.location.hash = '#/map';
        } catch (error) {
          console.warn('Add story gagal, mencoba simpan offline untuk sinkronisasi', error);
          try {
            const { savePendingStory } = await import('../../utils/idb.js');
            await savePendingStory({ description, photo, lat, lon });
            statusEl.textContent = 'Offline: Cerita disimpan dan akan di-sync saat online.';
            // Register background sync jika tersedia
            if ('serviceWorker' in navigator && 'SyncManager' in window) {
              const reg = await navigator.serviceWorker.ready;
              try { await reg.sync.register('sync-pending-stories'); } catch {}
            }
          } catch (e2) {
            console.error('Gagal menyimpan ke antrian offline', e2);
            statusEl.textContent = 'Terjadi kesalahan saat menambah story. Coba lagi.';
          }
        }
      });
    }
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
        
        // Base layers for add-story map
        const osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors'
        });
        const hot = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors, HOT'
        });
        osm.addTo(map);
        L.control.layers({ 'OpenStreetMap': osm, 'OSM HOT': hot }, {}).addTo(map);
        
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