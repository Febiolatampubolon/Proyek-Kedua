var P=n=>{throw TypeError(n)};var I=(n,t,e)=>t.has(n)||P("Cannot "+e);var l=(n,t,e)=>(I(n,t,"read from private field"),e?e.call(n):t.get(n)),w=(n,t,e)=>t.has(n)?P("Cannot add the same private member more than once"):t instanceof WeakSet?t.add(n):t.set(n,e),S=(n,t,e,r)=>(I(n,t,"write to private field"),r?r.call(n,e):t.set(n,e),e),p=(n,t,e)=>(I(n,t,"access private method"),e);(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))r(a);new MutationObserver(a=>{for(const o of a)if(o.type==="childList")for(const s of o.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&r(s)}).observe(document,{childList:!0,subtree:!0});function e(a){const o={};return a.integrity&&(o.integrity=a.integrity),a.referrerPolicy&&(o.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?o.credentials="include":a.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function r(a){if(a.ep)return;a.ep=!0;const o=e(a);fetch(a.href,o)}})();class T{async render(){return`
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
    `}async afterRender(){localStorage.getItem("token")||console.log("User not logged in")}}class D{async render(){return`
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
    `}async afterRender(){}}const b={BASE_URL:"https://story-api.dicoding.dev/v1",VAPID_PUBLIC_KEY:""},k={LIST:`${b.BASE_URL}/stories`,ADD:`${b.BASE_URL}/stories`,REGISTER:`${b.BASE_URL}/register`,LOGIN:`${b.BASE_URL}/login`};async function q(){return await(await fetch(k.LIST,{headers:{"Content-Type":"application/json"}})).json()}async function x({description:n,photo:t,lat:e,lon:r}){const a=new FormData;a.append("description",n),a.append("photo",t),a.append("lat",e),a.append("lon",r);const o=localStorage.getItem("token");return await(await fetch(k.ADD,{method:"POST",body:a,headers:o?{Authorization:`Bearer ${o}`}:void 0})).json()}async function C({name:n,email:t,password:e}){return await(await fetch(k.REGISTER,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:n,email:t,password:e})})).json()}async function j({email:n,password:t}){return await(await fetch(k.LOGIN,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:n,password:t})})).json()}class O{async render(){return`
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
    `}async afterRender(){const t=document.getElementById("login-form");t&&t.addEventListener("submit",async e=>{e.preventDefault();const r=document.getElementById("email").value,a=document.getElementById("password").value;try{const o=await j({email:r,password:a});if(o.error){o.message.includes("email")?document.getElementById("email-error").textContent=o.message:o.message.includes("password")?document.getElementById("password-error").textContent=o.message:alert(o.message);return}localStorage.setItem("token",o.loginResult.token),window.location.hash="#/"}catch(o){console.error("Login error:",o),alert("An error occurred during login. Please try again.")}})}}class ${async render(){return`
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
    `}async afterRender(){const t=document.getElementById("register-form");t&&t.addEventListener("submit",async e=>{e.preventDefault();const r=document.getElementById("name").value,a=document.getElementById("email").value,o=document.getElementById("password").value;try{const s=await C({name:r,email:a,password:o});if(s.error){s.message.includes("name")?document.getElementById("name-error").textContent=s.message:s.message.includes("email")?document.getElementById("email-error").textContent=s.message:s.message.includes("password")?document.getElementById("password-error").textContent=s.message:alert(s.message);return}alert("Registration successful! Please login."),window.location.hash="#/login"}catch(s){console.error("Registration error:",s),alert("An error occurred during registration. Please try again.")}})}}const U="stories-db",F=1;function v(){return new Promise((n,t)=>{const e=indexedDB.open(U,F);e.onupgradeneeded=()=>{const r=e.result;r.objectStoreNames.contains("stories")||r.createObjectStore("stories",{keyPath:"id"}),r.objectStoreNames.contains("queue")||r.createObjectStore("queue",{keyPath:"id",autoIncrement:!0})},e.onsuccess=()=>n(e.result),e.onerror=()=>t(e.error)})}async function _(n){const r=(await v()).transaction("stories","readwrite").objectStore("stories");await new Promise((a,o)=>{const s=r.clear();s.onsuccess=a,s.onerror=()=>o(s.error)}),await Promise.all(n.map(a=>new Promise((o,s)=>{const c=r.put(a);c.onsuccess=o,c.onerror=()=>s(c.error)})))}async function B(){const e=(await v()).transaction("stories","readonly").objectStore("stories");return await new Promise((r,a)=>{const o=e.getAll();o.onsuccess=()=>r(o.result||[]),o.onerror=()=>a(o.error)})}async function V(n){const r=(await v()).transaction("queue","readwrite").objectStore("queue");return await new Promise((a,o)=>{const s=r.add({...n,createdAt:Date.now()});s.onsuccess=()=>a(s.result),s.onerror=()=>o(s.error)})}async function W(){const e=(await v()).transaction("queue","readonly").objectStore("queue");return await new Promise((r,a)=>{const o=e.getAll();o.onsuccess=()=>r(o.result||[]),o.onerror=()=>a(o.error)})}async function G(n){const r=(await v()).transaction("queue","readwrite").objectStore("queue");return await new Promise((a,o)=>{const s=r.delete(n);s.onsuccess=()=>a(!0),s.onerror=()=>o(s.error)})}class H{async render(){return`
      <section class="map-container">
        <h2>Stories Map</h2>
        <div id="map" class="map-view"></div>
        <div id="stories-list" class="stories-list"></div>
      </section>
    `}async afterRender(){await this.loadLeaflet(),this.initMap(),await this.loadStories()}loadLeaflet(){return new Promise((t,e)=>{if(window.L){t();return}const r=document.createElement("link");r.rel="stylesheet",r.href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css",document.head.appendChild(r);const a=document.createElement("script");a.src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js",a.onload=t,a.onerror=e,document.body.appendChild(a)})}initMap(){const t=setInterval(()=>{if(window.L){clearInterval(t);const e=L.map("map").setView([0,0],2);L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}).addTo(e),this.map=e,e.on("click",r=>{const a=document.getElementById("lat"),o=document.getElementById("lon");a&&o&&(a.value=r.latlng.lat,o.value=r.latlng.lng)})}},100)}async loadStories(){try{const t=await q();if(t.error){console.error("Error fetching stories:",t.message);const e=await B();e.length>0&&(this.displayStoriesList(e),this.addMarkersToMap(e));return}this.displayStoriesList(t.list),this.addMarkersToMap(t.list),await _(t.list)}catch(t){try{const e=await B();if(e.length>0){this.displayStoriesList(e),this.addMarkersToMap(e);return}}catch{}console.error("Error loading stories:",t)}}displayStoriesList(t){const e=document.getElementById("stories-list");if(e){if(t.length===0){e.innerHTML="<p>No stories found.</p>";return}e.innerHTML=`
      <h3>Stories List</h3>
      <div class="stories-grid">
        ${t.map(r=>`
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
    `}}addMarkersToMap(t){if(this.map&&(this.markersLayer?this.markersLayer.clearLayers():this.markersLayer=L.layerGroup().addTo(this.map),t.forEach(e=>{if(e.lat&&e.lon){const r=L.marker([e.lat,e.lon]).addTo(this.markersLayer);r.bindPopup(`
          <div class="map-popup">
            <img src="${e.photo}" alt="${e.description||"Story photo"}" width="150">
            <p>${e.description||"No description"}</p>
            <small>Created: ${new Date(e.createdAt).toLocaleDateString()}</small>
          </div>
        `),r.on("click",()=>{document.querySelectorAll(".story-card").forEach(a=>{a.classList.remove("highlight"),a.dataset.id===e.id&&(a.classList.add("highlight"),a.scrollIntoView({behavior:"smooth",block:"nearest"}))})})}}),t.some(e=>e.lat&&e.lon))){const e=t.filter(r=>r.lat&&r.lon).map(r=>[r.lat,r.lon]);e.length>0&&this.map.fitBounds(e,{padding:[50,50]})}}}class z{async render(){return`
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
    `}async afterRender(){await this.loadLeaflet(),this.initMap();const t=document.getElementById("add-story-form");t&&t.addEventListener("submit",async r=>{r.preventDefault();const a=document.getElementById("description").value,o=document.getElementById("photo").files[0],s=parseFloat(document.getElementById("lat").value),c=parseFloat(document.getElementById("lon").value);if(!a||!o||isNaN(s)||isNaN(c)){alert("Please fill all fields correctly");return}if(!localStorage.getItem("token")){alert("You need to login first"),window.location.hash="#/login";return}try{const h=await x({description:a,photo:o,lat:s,lon:c});if(h&&h.error){alert(`Error: ${h.message}`);return}alert("Story added successfully!"),window.location.hash="#/map"}catch{await V({description:a,photo:o,lat:s,lon:c}),alert("Kamu sedang offline. Cerita disimpan dan akan dikirim saat online.")}}),"serviceWorker"in navigator&&Notification.permission==="granted"&&await(await navigator.serviceWorker.ready).pushManager.getSubscription();async function e(){const r=await W();if(!(!r||r.length===0))for(const a of r)try{const o=await x({description:a.description,photo:a.photo,lat:a.lat,lon:a.lon});if(!o||o.error)continue;await G(a.id)}catch{}}window.addEventListener("online",()=>{e()})}loadLeaflet(){return new Promise((t,e)=>{if(window.L){t();return}const r=document.createElement("link");r.rel="stylesheet",r.href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css",document.head.appendChild(r);const a=document.createElement("script");a.src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js",a.onload=t,a.onerror=e,document.body.appendChild(a)})}initMap(){const t=setInterval(()=>{if(window.L){clearInterval(t);const e=L.map("map").setView([0,0],2);L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}).addTo(e),this.map=e,e.on("click",r=>{const a=document.getElementById("lat"),o=document.getElementById("lon");a&&o&&(a.value=r.latlng.lat.toFixed(6),o.value=r.latlng.lng.toFixed(6),this.marker?this.marker.setLatLng(r.latlng):(this.marker=L.marker(r.latlng,{draggable:!0}).addTo(e),this.marker.on("dragend",s=>{const c=s.target.getLatLng();a.value=c.lat.toFixed(6),o.value=c.lng.toFixed(6)})))})}},100)}}const K={"/":new T,"/about":new D,"/login":new O,"/register":new $,"/map":new H,"/add-story":new z};function Y(n){const t=n.split("/");return{resource:t[1]||null,id:t[2]||null}}function J(n){let t="";return n.resource&&(t=t.concat(`/${n.resource}`)),n.id&&(t=t.concat("/:id")),t||"/"}function Q(){return location.hash.replace("#","")||"/"}function X(){const n=Q(),t=Y(n);return J(t)}var f,y,m,i,A,M,g,R;class Z{constructor({navigationDrawer:t,drawerButton:e,content:r}){w(this,i);w(this,f,null);w(this,y,null);w(this,m,null);S(this,f,r),S(this,y,e),S(this,m,t),p(this,i,A).call(this),p(this,i,M).call(this)}async renderPage(){const t=X(),e=K[t];if(p(this,i,R).call(this,t)&&!localStorage.getItem("token")){window.location.hash="#/login";return}document.startViewTransition?await document.startViewTransition(async()=>{l(this,f).innerHTML=await e.render(),await e.afterRender(),p(this,i,g).call(this)}).ready:(l(this,f).innerHTML=await e.render(),await e.afterRender(),p(this,i,g).call(this))}}f=new WeakMap,y=new WeakMap,m=new WeakMap,i=new WeakSet,A=function(){l(this,y).addEventListener("click",()=>{l(this,m).classList.toggle("open")}),document.body.addEventListener("click",t=>{!l(this,m).contains(t.target)&&!l(this,y).contains(t.target)&&l(this,m).classList.remove("open"),l(this,m).querySelectorAll("a").forEach(e=>{e.contains(t.target)&&l(this,m).classList.remove("open")})})},M=function(){p(this,i,g).call(this),window.addEventListener("storage",t=>{t.key==="token"&&p(this,i,g).call(this)})},g=function(){const t=document.getElementById("auth-links"),e=localStorage.getItem("token");if(t)if(e){t.innerHTML='<a href="#/" id="logout-link">Logout</a>';const r=document.getElementById("logout-link");r&&r.addEventListener("click",a=>{a.preventDefault(),localStorage.removeItem("token"),p(this,i,g).call(this),window.location.hash="#/"})}else t.innerHTML=`
          <a href="#/login">Login</a>
          <a href="#/register">Register</a>
        `},R=function(t){return["/add-story"].includes(t)};document.addEventListener("DOMContentLoaded",async()=>{var E,h;const n=new Z({content:document.querySelector("#main-content"),drawerButton:document.querySelector("#drawer-button"),navigationDrawer:document.querySelector("#navigation-drawer")});if(await n.renderPage(),window.addEventListener("hashchange",async()=>{await n.renderPage()}),"serviceWorker"in navigator)try{await navigator.serviceWorker.register("/Proyek-Kedua/sw.js",{scope:"/Proyek-Kedua/"})}catch(d){console.error("SW registration failed",d)}let t=null;const e=document.createElement("button");e.id="install-button",e.className="btn btn-secondary",e.textContent="Install App",e.style.display="none",(E=document.querySelector(".main-header"))==null||E.appendChild(e),window.addEventListener("beforeinstallprompt",d=>{d.preventDefault(),t=d,e.style.display="inline-block"}),e.addEventListener("click",async()=>{if(!t)return;t.prompt(),(await t.userChoice).outcome==="accepted"&&(e.style.display="none",t=null)});const r=document.createElement("button");r.id="notif-toggle",r.className="btn btn-secondary",r.textContent="Aktifkan Notifikasi",(h=document.querySelector(".main-header"))==null||h.appendChild(r);async function a(){return await navigator.serviceWorker.ready}async function o(){const u=await(await a()).pushManager.getSubscription();return u||(alert("VAPID public key belum dikonfigurasi."),null)}async function s(){const u=await(await a()).pushManager.getSubscription();if(u){try{await fetch(`${b.BASE_URL}/push/subscriptions`,{method:"DELETE",headers:{"Content-Type":"application/json"},body:JSON.stringify(await u.toJSON())})}catch(N){console.warn("Gagal hapus subscription di server",N)}await u.unsubscribe()}}async function c(){const u=await(await a()).pushManager.getSubscription();r.textContent=u?"Nonaktifkan Notifikasi":"Aktifkan Notifikasi"}r.addEventListener("click",async()=>{await(await a()).pushManager.getSubscription()?await s():await o(),await c()}),"serviceWorker"in navigator&&c()});
