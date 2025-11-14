var I=o=>{throw TypeError(o)};var k=(o,e,t)=>e.has(o)||I("Cannot "+t);var l=(o,e,t)=>(k(o,e,"read from private field"),t?t.call(o):e.get(o)),w=(o,e,t)=>e.has(o)?I("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(o):e.set(o,t),b=(o,e,t,r)=>(k(o,e,"write to private field"),r?r.call(o,t):e.set(o,t),t),p=(o,e,t)=>(k(o,e,"access private method"),t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))r(a);new MutationObserver(a=>{for(const n of a)if(n.type==="childList")for(const s of n.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&r(s)}).observe(document,{childList:!0,subtree:!0});function t(a){const n={};return a.integrity&&(n.integrity=a.integrity),a.referrerPolicy&&(n.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?n.credentials="include":a.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function r(a){if(a.ep)return;a.ep=!0;const n=t(a);fetch(a.href,n)}})();class x{async render(){return`
      <section class="container">
        <h1>Welcome to Stories Map</h1>
        <p>Share your experiences and explore stories from around the world!</p>
        
        <div class="home-actions">
          <a href="#/map" class="btn btn-primary">View Stories Map</a>
          <a href="#/add-story" class="btn btn-secondary">Add Your Story</a>
        </div>
        
        <div class="features">
          <div class="feature-card">
            <h3>🌍 Explore Stories</h3>
            <p>Discover amazing stories from people around the globe on our interactive map.</p>
          </div>
          
          <div class="feature-card">
            <h3>📝 Share Your Experience</h3>
            <p>Contribute to our community by sharing your own stories with photos and locations.</p>
          </div>
          
          <div class="feature-card">
            <h3>🔒 Secure & Private</h3>
            <p>Your data is protected with secure authentication and privacy controls.</p>
          </div>
        </div>
      </section>
    `}async afterRender(){localStorage.getItem("token")||console.log("User not logged in")}}class T{async render(){return`
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
    `}async afterRender(){}}const v={BASE_URL:"https://story-api.dicoding.dev/v1",VAPID_PUBLIC_KEY:""},S={LIST:`${v.BASE_URL}/stories`,ADD:`${v.BASE_URL}/stories`,REGISTER:`${v.BASE_URL}/register`,LOGIN:`${v.BASE_URL}/login`};async function M(){return await(await fetch(S.LIST,{headers:{"Content-Type":"application/json"}})).json()}async function C({description:o,photo:e,lat:t,lon:r}){const a=new FormData;a.append("description",o),a.append("photo",e),a.append("lat",t),a.append("lon",r);const n=localStorage.getItem("token");return await(await fetch(S.ADD,{method:"POST",body:a,headers:n?{Authorization:`Bearer ${n}`}:void 0})).json()}async function N({name:o,email:e,password:t}){return await(await fetch(S.REGISTER,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:o,email:e,password:t})})).json()}async function D({email:o,password:e}){return await(await fetch(S.LOGIN,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:o,password:e})})).json()}class q{async render(){return`
      <section class="auth-container">
        <div class="auth-card">
          <h2>Login</h2>
          <form id="login-form">
            <div class="form-group">
              <label for="email">Email:</label>
              <input type="email" id="email" name="email" required aria-describedby="email-error">
              <span id="email-error" class="error-message" role="alert"></span>
            </div>
            
            <div class="form-group">
              <label for="password">Password:</label>
              <input type="password" id="password" name="password" required aria-describedby="password-error">
              <span id="password-error" class="error-message" role="alert"></span>
            </div>
            
            <button type="submit" class="btn btn-primary">Login</button>
          </form>
          <p>Don't have an account? <a href="#/register">Register here</a></p>
        </div>
      </section>
    `}async afterRender(){const e=document.getElementById("login-form");e&&e.addEventListener("submit",async t=>{t.preventDefault();const r=document.getElementById("email").value,a=document.getElementById("password").value;try{const n=await D({email:r,password:a});if(n.error){n.message.includes("email")?document.getElementById("email-error").textContent=n.message:n.message.includes("password")?document.getElementById("password-error").textContent=n.message:alert(n.message);return}localStorage.setItem("token",n.loginResult.token),window.location.hash="#/"}catch(n){console.error("Login error:",n),alert("An error occurred during login. Please try again.")}})}}class O{async render(){return`
      <section class="auth-container">
        <div class="auth-card">
          <h2>Register</h2>
          <form id="register-form">
            <div class="form-group">
              <label for="name">Name:</label>
              <input type="text" id="name" name="name" required aria-describedby="name-error">
              <span id="name-error" class="error-message" role="alert"></span>
            </div>
            
            <div class="form-group">
              <label for="email">Email:</label>
              <input type="email" id="email" name="email" required aria-describedby="email-error">
              <span id="email-error" class="error-message" role="alert"></span>
            </div>
            
            <div class="form-group">
              <label for="password">Password:</label>
              <input type="password" id="password" name="password" required aria-describedby="password-error">
              <span id="password-error" class="error-message" role="alert"></span>
            </div>
            
            <button type="submit" class="btn btn-primary">Register</button>
          </form>
          <p>Already have an account? <a href="#/login">Login here</a></p>
        </div>
      </section>
    `}async afterRender(){const e=document.getElementById("register-form");e&&e.addEventListener("submit",async t=>{t.preventDefault();const r=document.getElementById("name").value,a=document.getElementById("email").value,n=document.getElementById("password").value;try{const s=await N({name:r,email:a,password:n});if(s.error){s.message.includes("name")?document.getElementById("name-error").textContent=s.message:s.message.includes("email")?document.getElementById("email-error").textContent=s.message:s.message.includes("password")?document.getElementById("password-error").textContent=s.message:alert(s.message);return}alert("Registration successful! Please login."),window.location.hash="#/login"}catch(s){console.error("Registration error:",s),alert("An error occurred during registration. Please try again.")}})}}class ${async render(){return`
      <section class="map-container">
        <h2>Stories Map</h2>
        <div id="map" class="map-view"></div>
        <div id="stories-list" class="stories-list"></div>
      </section>
    `}async afterRender(){await this.loadLeaflet(),this.initMap(),await this.loadStories()}loadLeaflet(){return new Promise((e,t)=>{if(window.L){e();return}const r=document.createElement("link");r.rel="stylesheet",r.href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css",document.head.appendChild(r);const a=document.createElement("script");a.src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js",a.onload=e,a.onerror=t,document.body.appendChild(a)})}initMap(){const e=setInterval(()=>{if(window.L){clearInterval(e);const t=L.map("map").setView([0,0],2);L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}).addTo(t),this.map=t,t.on("click",r=>{const a=document.getElementById("lat"),n=document.getElementById("lon");a&&n&&(a.value=r.latlng.lat,n.value=r.latlng.lng)})}},100)}async loadStories(){try{const e=await M();if(e.error){console.error("Error fetching stories:",e.message);return}this.displayStoriesList(e.list),this.addMarkersToMap(e.list)}catch(e){console.error("Error loading stories:",e)}}displayStoriesList(e){const t=document.getElementById("stories-list");if(t){if(e.length===0){t.innerHTML="<p>No stories found.</p>";return}t.innerHTML=`
      <h3>Stories List</h3>
      <div class="stories-grid">
        ${e.map(r=>`
          <div class="story-card" data-id="${r.id}">
            <img src="${r.photo}" alt="${r.description||"Story photo"}" loading="lazy">
            <div class="story-content">
              <p>${r.description||"No description"}</p>
              <small>Created: ${new Date(r.createdAt).toLocaleDateString()}</small>
              <small>Location: ${r.lat}, ${r.lon}</small>
            </div>
          </div>
        `).join("")}
      </div>
    `}}addMarkersToMap(e){if(this.map&&(this.markersLayer?this.markersLayer.clearLayers():this.markersLayer=L.layerGroup().addTo(this.map),e.forEach(t=>{if(t.lat&&t.lon){const r=L.marker([t.lat,t.lon]).addTo(this.markersLayer);r.bindPopup(`
          <div class="map-popup">
            <img src="${t.photo}" alt="${t.description||"Story photo"}" width="150">
            <p>${t.description||"No description"}</p>
            <small>Created: ${new Date(t.createdAt).toLocaleDateString()}</small>
          </div>
        `),r.on("click",()=>{document.querySelectorAll(".story-card").forEach(a=>{a.classList.remove("highlight"),a.dataset.id===t.id&&(a.classList.add("highlight"),a.scrollIntoView({behavior:"smooth",block:"nearest"}))})})}}),e.some(t=>t.lat&&t.lon))){const t=e.filter(r=>r.lat&&r.lon).map(r=>[r.lat,r.lon]);t.length>0&&this.map.fitBounds(t,{padding:[50,50]})}}}class j{async render(){return`
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
    `}async afterRender(){await this.loadLeaflet(),this.initMap();const e=document.getElementById("add-story-form");e&&e.addEventListener("submit",async t=>{t.preventDefault();const r=document.getElementById("description").value,a=document.getElementById("photo").files[0],n=parseFloat(document.getElementById("lat").value),s=parseFloat(document.getElementById("lon").value);if(!r||!a||isNaN(n)||isNaN(s)){alert("Please fill all fields correctly");return}if(!localStorage.getItem("token")){alert("You need to login first"),window.location.hash="#/login";return}try{const m=await C({description:r,photo:a,lat:n,lon:s});if(m.error){alert(`Error: ${m.message}`);return}alert("Story added successfully!"),window.location.hash="#/map"}catch(m){console.error("Error adding story:",m),alert("An error occurred while adding the story. Please try again.")}})}loadLeaflet(){return new Promise((e,t)=>{if(window.L){e();return}const r=document.createElement("link");r.rel="stylesheet",r.href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css",document.head.appendChild(r);const a=document.createElement("script");a.src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js",a.onload=e,a.onerror=t,document.body.appendChild(a)})}initMap(){const e=setInterval(()=>{if(window.L){clearInterval(e);const t=L.map("map").setView([0,0],2);L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}).addTo(t),this.map=t,t.on("click",r=>{const a=document.getElementById("lat"),n=document.getElementById("lon");a&&n&&(a.value=r.latlng.lat.toFixed(6),n.value=r.latlng.lng.toFixed(6),this.marker?this.marker.setLatLng(r.latlng):(this.marker=L.marker(r.latlng,{draggable:!0}).addTo(t),this.marker.on("dragend",s=>{const h=s.target.getLatLng();a.value=h.lat.toFixed(6),n.value=h.lng.toFixed(6)})))})}},100)}}const U={"/":new x,"/about":new T,"/login":new q,"/register":new O,"/map":new $,"/add-story":new j};function F(o){const e=o.split("/");return{resource:e[1]||null,id:e[2]||null}}function G(o){let e="";return o.resource&&(e=e.concat(`/${o.resource}`)),o.id&&(e=e.concat("/:id")),e||"/"}function H(){return location.hash.replace("#","")||"/"}function V(){const o=H(),e=F(o);return G(e)}var f,y,u,i,P,A,g,B;class _{constructor({navigationDrawer:e,drawerButton:t,content:r}){w(this,i);w(this,f,null);w(this,y,null);w(this,u,null);b(this,f,r),b(this,y,t),b(this,u,e),p(this,i,P).call(this),p(this,i,A).call(this)}async renderPage(){const e=V(),t=U[e];if(p(this,i,B).call(this,e)&&!localStorage.getItem("token")){window.location.hash="#/login";return}document.startViewTransition?await document.startViewTransition(async()=>{l(this,f).innerHTML=await t.render(),await t.afterRender(),p(this,i,g).call(this)}).ready:(l(this,f).innerHTML=await t.render(),await t.afterRender(),p(this,i,g).call(this))}}f=new WeakMap,y=new WeakMap,u=new WeakMap,i=new WeakSet,P=function(){l(this,y).addEventListener("click",()=>{l(this,u).classList.toggle("open")}),document.body.addEventListener("click",e=>{!l(this,u).contains(e.target)&&!l(this,y).contains(e.target)&&l(this,u).classList.remove("open"),l(this,u).querySelectorAll("a").forEach(t=>{t.contains(e.target)&&l(this,u).classList.remove("open")})})},A=function(){p(this,i,g).call(this),window.addEventListener("storage",e=>{e.key==="token"&&p(this,i,g).call(this)})},g=function(){const e=document.getElementById("auth-links"),t=localStorage.getItem("token");if(e)if(t){e.innerHTML='<a href="#/" id="logout-link">Logout</a>';const r=document.getElementById("logout-link");r&&r.addEventListener("click",a=>{a.preventDefault(),localStorage.removeItem("token"),p(this,i,g).call(this),window.location.hash="#/"})}else e.innerHTML=`
          <a href="#/login">Login</a>
          <a href="#/register">Register</a>
        `},B=function(e){return["/add-story"].includes(e)};document.addEventListener("DOMContentLoaded",async()=>{var m,E;const o=new _({content:document.querySelector("#main-content"),drawerButton:document.querySelector("#drawer-button"),navigationDrawer:document.querySelector("#navigation-drawer")});if(await o.renderPage(),window.addEventListener("hashchange",async()=>{await o.renderPage()}),"serviceWorker"in navigator)try{await navigator.serviceWorker.register("/Proyek-Kedua/sw.js",{scope:"/Proyek-Kedua/"})}catch(c){console.error("SW registration failed",c)}let e=null;const t=document.createElement("button");t.id="install-button",t.className="btn btn-secondary",t.textContent="Install App",t.style.display="none",(m=document.querySelector(".main-header"))==null||m.appendChild(t),window.addEventListener("beforeinstallprompt",c=>{c.preventDefault(),e=c,t.style.display="inline-block"}),t.addEventListener("click",async()=>{if(!e)return;e.prompt(),(await e.userChoice).outcome==="accepted"&&(t.style.display="none",e=null)});const r=document.createElement("button");r.id="notif-toggle",r.className="btn btn-secondary",r.textContent="Aktifkan Notifikasi",(E=document.querySelector(".main-header"))==null||E.appendChild(r);async function a(){return await navigator.serviceWorker.ready}async function n(){const d=await(await a()).pushManager.getSubscription();return d||(alert("VAPID public key belum dikonfigurasi."),null)}async function s(){const d=await(await a()).pushManager.getSubscription();if(d){try{await fetch(`${v.BASE_URL}/push/subscriptions`,{method:"DELETE",headers:{"Content-Type":"application/json"},body:JSON.stringify(await d.toJSON())})}catch(R){console.warn("Gagal hapus subscription di server",R)}await d.unsubscribe()}}async function h(){const d=await(await a()).pushManager.getSubscription();r.textContent=d?"Nonaktifkan Notifikasi":"Aktifkan Notifikasi"}r.addEventListener("click",async()=>{await(await a()).pushManager.getSubscription()?await s():await n(),await h()}),"serviceWorker"in navigator&&h()});
