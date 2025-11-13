import { getStories } from '../../data/api.js';

export default class MapPage {
  async render() {
    return `
      <section class="map-container">
        <h1>Stories Map</h1>
        <div class="map-toolbar" aria-label="Map controls">
          <label for="filter-input">Filter deskripsi:</label>
          <input id="filter-input" type="text" placeholder="Ketik untuk filter" aria-describedby="filter-help" />
          <small id="filter-help">Filter daftar dan marker berdasarkan deskripsi.</small>
          <button id="notif-toggle" class="btn btn-secondary" style="margin-left:auto">Enable Notifications</button>
        </div>
        <div id="map" class="map-view"></div>
        <div id="stories-list" class="stories-list"></div>
        <div id="saved-stories" class="stories-list"></div>
      </section>
    `;
  }

  async afterRender() {
    // Load map library
    await this.loadLeaflet();
    
    // Initialize map
    this.initMap();
    
    // Load stories
    await this.loadStories();
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

        // Base tile layers
        const osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors'
        });
        const hot = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors, HOT'
        });

        // Add default layer and layer control
        osm.addTo(map);
        const baseLayers = {
          'OpenStreetMap': osm,
          'OSM HOT': hot,
        };
        L.control.layers(baseLayers, {}).addTo(map);
        
        // Store map instance
        this.map = map;
        
        // Add click event to get coordinates
        map.on('click', (e) => {
          // If we're in add story mode, update the form
          const latInput = document.getElementById('lat');
          const lonInput = document.getElementById('lon');
          
          if (latInput && lonInput) {
            latInput.value = e.latlng.lat;
            lonInput.value = e.latlng.lng;
          }
        });
      }
    }, 100);
  }

  async loadStories() {
    try {
      const result = await getStories({ withLocation: true });
      
      if (result.error) {
        console.error('Error fetching stories:', result.message);
        return;
      }
      
      // Display stories in list
      const stories = result.listStory || [];
      this.stories = stories;
      this.displayStoriesList(stories);

      // Add markers to map
      this.addMarkersToMap(stories);

      // Hook up filter
      const filterInput = document.getElementById('filter-input');
      if (filterInput) {
        filterInput.addEventListener('input', () => {
          const q = filterInput.value.toLowerCase();
          const filtered = this.stories.filter(s => (s.description || '').toLowerCase().includes(q));
          this.displayStoriesList(filtered);
          this.addMarkersToMap(filtered);
        });
      }

      // Notifications toggle
      this.setupNotificationToggle();
      // Load saved offline stories
      this.loadSavedStories();
    } catch (error) {
      console.error('Error loading stories:', error);
    }
  }

  displayStoriesList(stories) {
    const storiesList = document.getElementById('stories-list');
    if (!storiesList) return;
    
    if (stories.length === 0) {
      storiesList.innerHTML = '<p>No stories found.</p>';
      return;
    }
    
    storiesList.innerHTML = `
      <h2>Stories List</h2>
      <div class="stories-grid">
        ${stories.map(story => `
          <article class="story-card" data-id="${story.id}" tabindex="0" aria-label="Story ${story.name}">
            <img src="${story.photoUrl}" alt="${story.description || 'Story photo'}" loading="lazy">
            <div class="story-content">
              <p>${story.description || 'No description'}</p>
              <small>By: ${story.name || 'Unknown'}</small>
              <small>Created: ${new Date(story.createdAt).toLocaleDateString()}</small>
              <small>Location: ${story.lat}, ${story.lon}</small>
              <div style="margin-top:8px">
                <button class="btn btn-primary save-offline" data-id="${story.id}">Save Offline</button>
              </div>
            </div>
          </article>
        `).join('')}
      </div>
    `;

    // Sync list -> map: click or Enter focuses marker and opens popup
    storiesList.querySelectorAll('.story-card').forEach(card => {
      card.addEventListener('click', () => this.focusMarker(card.dataset.id));
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.focusMarker(card.dataset.id);
        }
      });
    });

    // Save offline handlers
    storiesList.querySelectorAll('.save-offline').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const story = stories.find(s => s.id === id);
        if (story) this.saveStory(story);
      });
    });
  }

  addMarkersToMap(stories) {
    if (!this.map) return;
    
    // Clear existing markers
    if (this.markersLayer) {
      this.markersLayer.clearLayers();
    } else {
      this.markersLayer = L.layerGroup().addTo(this.map);
    }
    this.markersById = new Map();
    
    // Add markers for each story
    stories.forEach(story => {
      if (story.lat && story.lon) {
        const marker = L.marker([story.lat, story.lon]).addTo(this.markersLayer);
        marker.bindPopup(`
          <div class="map-popup">
            <img src="${story.photoUrl}" alt="${story.description || 'Story photo'}" width="150">
            <p>${story.description || 'No description'}</p>
            <small>Created: ${new Date(story.createdAt).toLocaleDateString()}</small>
          </div>
        `);
        
        // Add click event to show story details
        marker.on('click', () => {
          // Highlight the corresponding story card
          document.querySelectorAll('.story-card').forEach(card => {
            card.classList.remove('highlight');
            if (card.dataset.id === story.id) {
              card.classList.add('highlight');
              card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
          });
        });

        this.markersById.set(story.id, marker);
      }
    });
    
    // Fit map to bounds if we have markers
    if (stories.some(s => s.lat && s.lon)) {
      const bounds = stories
        .filter(s => s.lat && s.lon)
        .map(s => [s.lat, s.lon]);
      
      if (bounds.length > 0) {
        this.map.fitBounds(bounds, { padding: [50, 50] });
      }
    }
  }

  focusMarker(id) {
    if (!this.markersById || !this.markersById.has(id)) return;
    const marker = this.markersById.get(id);
    marker.openPopup();
    const latLng = marker.getLatLng();
    this.map.setView(latLng, Math.max(this.map.getZoom(), 8), { animate: true });
    document.querySelectorAll('.story-card').forEach(card => {
      card.classList.toggle('highlight', card.dataset.id === id);
    });
  }

  async saveStory(story) {
    const { saveStoryOffline } = await import('../../utils/idb.js');
    await saveStoryOffline({
      id: story.id,
      name: story.name,
      description: story.description,
      photoUrl: story.photoUrl,
      lat: story.lat,
      lon: story.lon,
      createdAt: story.createdAt,
    });
    this.loadSavedStories();
  }

  async loadSavedStories() {
    const savedContainer = document.getElementById('saved-stories');
    if (!savedContainer) return;
    const { getSavedStories, deleteSavedStory } = await import('../../utils/idb.js');
    const saved = await getSavedStories();
    savedContainer.innerHTML = `
      <h2>Saved Stories (Offline)</h2>
      ${saved.length === 0 ? '<p>No saved stories.</p>' : `
        <div class="stories-grid">
          ${saved.map(story => `
            <article class="story-card" data-id="${story.id}">
              <img src="${story.photoUrl}" alt="${story.description || 'Story photo'}" loading="lazy">
              <div class="story-content">
                <p>${story.description || 'No description'}</p>
                <small>By: ${story.name || 'Unknown'}</small>
                <small>Created: ${new Date(story.createdAt).toLocaleDateString()}</small>
                <small>Location: ${story.lat}, ${story.lon}</small>
                <div style="margin-top:8px">
                  <button class="btn btn-secondary remove-offline" data-id="${story.id}">Remove</button>
                </div>
              </div>
            </article>
          `).join('')}
        </div>
      `}
    `;
    savedContainer.querySelectorAll('.remove-offline').forEach(btn => {
      btn.addEventListener('click', async () => {
        await deleteSavedStory(btn.dataset.id);
        this.loadSavedStories();
      });
    });
  }

  async setupNotificationToggle() {
    const btn = document.getElementById('notif-toggle');
    if (!btn) return;
    const { isSubscribed, subscribePush, unsubscribePush } = await import('../../utils/push.js');
    const updateLabel = async () => {
      btn.textContent = (await isSubscribed()) ? 'Disable Notifications' : 'Enable Notifications';
    };
    await updateLabel();
    btn.addEventListener('click', async () => {
      try {
        if (await isSubscribed()) {
          await unsubscribePush();
        } else {
          await subscribePush();
        }
        await updateLabel();
      } catch (err) {
        alert(err.message || 'Notification toggle failed');
      }
    });
  }
}