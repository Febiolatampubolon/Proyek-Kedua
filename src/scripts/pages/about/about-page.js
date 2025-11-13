export default class AboutPage {
  async render() {
    return `
      <section class="container">
        <h1>About Stories Map</h1>
        <p>Stories Map is an interactive web application that allows users to share their experiences and stories from around the world. The application combines the power of storytelling with geographic visualization to create a unique platform for cultural exchange.</p>
        
        <div class="features">
          <div class="feature-card">
            <h3>🗺️ Interactive Map</h3>
            <p>Explore stories from different locations around the globe using our interactive map interface powered by Leaflet.js.</p>
          </div>
          
          <div class="feature-card">
            <h3>📸 Photo Sharing</h3>
            <p>Share your experiences with high-quality photos that are displayed both in the story list and on the map.</p>
          </div>
          
          <div class="feature-card">
            <h3>🔒 Secure Authentication</h3>
            <p>Protect your account with our secure authentication system that keeps your data safe.</p>
          </div>
          
          <div class="feature-card">
            <h3>📱 Responsive Design</h3>
            <p>Enjoy a seamless experience across all devices, from mobile phones to desktop computers.</p>
          </div>
        </div>
        
        <h2>How It Works</h2>
        <ol>
          <li>Create an account or login to access all features</li>
          <li>Click on the map to select a location for your story</li>
          <li>Upload a photo and write a description of your experience</li>
          <li>Share your story with the world!</li>
        </ol>
        
        <div class="cta-section">
          <a href="#/register" class="btn btn-primary">Get Started</a>
          <a href="#/map" class="btn btn-secondary">Explore Stories</a>
        </div>
      </section>
    `;
  }

  async afterRender() {
    // Initialize any interactive elements if needed
  }
}
