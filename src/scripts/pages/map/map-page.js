import { getStories } from '../../data/api.js';
import { saveStories, getCachedStories } from '../../utils/idb.js';

export default class MapPage {
  async render() {
    return `
      <section class="map-container">
        <h2>Stories Map</h2>
        <div id="map" class="map-view"></div>
        <div id="stories-list" class="stories-list"></div>
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
        
        // Add tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
        
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
      const result = await getStories();
      
      if (result.error) {
        console.error('Error fetching stories:', result.message);
        const cached = await getCachedStories();
        if (cached.length > 0) {
          this.displayStoriesList(cached);
          this.addMarkersToMap(cached);
        }
        return;
      }
      
      // Display stories in list
      this.displayStoriesList(result.list);
      
      // Add markers to map
      this.addMarkersToMap(result.list);

      await saveStories(result.list);
    } catch (error) {
      try {
        const cached = await getCachedStories();
        if (cached.length > 0) {
          this.displayStoriesList(cached);
          this.addMarkersToMap(cached);
          return;
        }
      } catch (_) {}
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
      <h3>Stories List</h3>
      <div class="stories-grid">
        ${stories.map(story => `
          <div class="story-card" data-id="${story.id}">
            <img src="${story.photo}" alt="${story.description || 'Story photo'}" loading="lazy">
            <div class="story-content">
              <p>${story.description || 'No description'}</p>
              <small>Created: ${new Date(story.createdAt).toLocaleDateString()}</small>
              <small>Location: ${story.lat}, ${story.lon}</small>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  addMarkersToMap(stories) {
    if (!this.map) return;
    
    // Clear existing markers
    if (this.markersLayer) {
      this.markersLayer.clearLayers();
    } else {
      this.markersLayer = L.layerGroup().addTo(this.map);
    }
    
    // Add markers for each story
    stories.forEach(story => {
      if (story.lat && story.lon) {
        const marker = L.marker([story.lat, story.lon]).addTo(this.markersLayer);
        marker.bindPopup(`
          <div class="map-popup">
            <img src="${story.photo}" alt="${story.description || 'Story photo'}" width="150">
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
}