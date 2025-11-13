var T=n=>{throw TypeError(n)};var A=(n,e,t)=>e.has(n)||T("Cannot "+t);var d=(n,e,t)=>(A(n,e,"read from private field"),t?t.call(n):e.get(n)),E=(n,e,t)=>e.has(n)?T("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(n):e.set(n,t),P=(n,e,t,a)=>(A(n,e,"write to private field"),a?a.call(n,t):e.set(n,t),t),g=(n,e,t)=>(A(n,e,"access private method"),t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))a(r);new MutationObserver(r=>{for(const o of r)if(o.type==="childList")for(const s of o.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&a(s)}).observe(document,{childList:!0,subtree:!0});function t(r){const o={};return r.integrity&&(o.integrity=r.integrity),r.referrerPolicy&&(o.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?o.credentials="include":r.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function a(r){if(r.ep)return;r.ep=!0;const o=t(r);fetch(r.href,o)}})();class q{async render(){return`
      <section class="container">
        <h1>Welcome to Stories Map</h1>
        <p>Share your experiences and explore stories from around the world!</p>
        
        <div class="home-actions">
          <a href="#/map" class="btn btn-primary">View Stories Map</a>
          <a href="#/add-story" class="btn btn-secondary">Add Your Story</a>
        </div>
        
        <h2>Features</h2>
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
    `}async afterRender(){localStorage.getItem("token")||console.log("User not logged in")}}class U{async render(){return`
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
    `}async afterRender(){}}const k={BASE_URL:"https://story-api.dicoding.dev/v1",VAPID_PUBLIC_KEY:"BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk"},I={LIST:`${k.BASE_URL}/stories`,ADD:`${k.BASE_URL}/stories`,ADD_GUEST:`${k.BASE_URL}/stories/guest`,REGISTER:`${k.BASE_URL}/register`,LOGIN:`${k.BASE_URL}/login`};async function F({page:n=1,size:e=30,withLocation:t=!0}={}){const a=localStorage.getItem("token"),r=new URLSearchParams;return r.set("page",n),r.set("size",e),t&&r.set("location",1),await(await fetch(`${I.LIST}?${r.toString()}`,{headers:{"Content-Type":"application/json",...a?{Authorization:`Bearer ${a}`}:{}}})).json()}async function M({description:n,photo:e,lat:t,lon:a}){const r=new FormData;r.append("description",n),r.append("photo",e),r.append("lat",t),r.append("lon",a);const o=localStorage.getItem("token"),s=o?I.ADD:I.ADD_GUEST;return await(await fetch(s,{method:"POST",headers:{...o?{Authorization:`Bearer ${o}`}:{}},body:r})).json()}async function z({name:n,email:e,password:t}){return await(await fetch(I.REGISTER,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:n,email:e,password:t})})).json()}async function H({email:n,password:e}){return await(await fetch(I.LOGIN,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:n,password:e})})).json()}class G{async render(){return`
      <section class="auth-container">
        <div class="auth-card">
          <h1>Login</h1>
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
    `}async afterRender(){const e=document.getElementById("login-form");e&&e.addEventListener("submit",async t=>{t.preventDefault();const a=document.getElementById("email").value,r=document.getElementById("password").value;try{const o=await H({email:a,password:r});if(o.error){o.message.includes("email")?document.getElementById("email-error").textContent=o.message:o.message.includes("password")?document.getElementById("password-error").textContent=o.message:alert(o.message);return}localStorage.setItem("token",o.loginResult.token),window.location.hash="#/"}catch(o){console.error("Login error:",o),alert("An error occurred during login. Please try again.")}})}}class V{async render(){return`
      <section class="auth-container">
        <div class="auth-card">
          <h1>Register</h1>
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
    `}async afterRender(){const e=document.getElementById("register-form");e&&e.addEventListener("submit",async t=>{t.preventDefault();const a=document.getElementById("name").value,r=document.getElementById("email").value,o=document.getElementById("password").value;try{const s=await z({name:a,email:r,password:o});if(s.error){s.message.includes("name")?document.getElementById("name-error").textContent=s.message:s.message.includes("email")?document.getElementById("email-error").textContent=s.message:s.message.includes("password")?document.getElementById("password-error").textContent=s.message:alert(s.message);return}alert("Registration successful! Please login."),window.location.hash="#/login"}catch(s){console.error("Registration error:",s),alert("An error occurred during registration. Please try again.")}})}}const W="modulepreload",Y=function(n){return"/"+n},O={},B=function(e,t,a){let r=Promise.resolve();if(t&&t.length>0){document.getElementsByTagName("link");const s=document.querySelector("meta[property=csp-nonce]"),i=(s==null?void 0:s.nonce)||(s==null?void 0:s.getAttribute("nonce"));r=Promise.allSettled(t.map(l=>{if(l=Y(l),l in O)return;O[l]=!0;const u=l.endsWith(".css"),m=u?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${l}"]${m}`))return;const h=document.createElement("link");if(h.rel=u?"stylesheet":W,u||(h.as="script"),h.crossOrigin="",h.href=l,i&&h.setAttribute("nonce",i),document.head.appendChild(h),u)return new Promise((f,y)=>{h.addEventListener("load",f),h.addEventListener("error",()=>y(new Error(`Unable to preload CSS for ${l}`)))})}))}function o(s){const i=new Event("vite:preloadError",{cancelable:!0});if(i.payload=s,window.dispatchEvent(i),!i.defaultPrevented)throw s}return r.then(s=>{for(const i of s||[])i.status==="rejected"&&o(i.reason);return e().catch(o)})};class J{async render(){return`
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
    `}async afterRender(){await this.loadLeaflet(),this.initMap(),await this.loadStories()}loadLeaflet(){return new Promise((e,t)=>{if(window.L){e();return}const a=document.createElement("link");a.rel="stylesheet",a.href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css",document.head.appendChild(a);const r=document.createElement("script");r.src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js",r.onload=e,r.onerror=t,document.body.appendChild(r)})}initMap(){const e=setInterval(()=>{if(window.L){clearInterval(e);const t=L.map("map").setView([0,0],2),a=L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:"&copy; OpenStreetMap contributors"}),r=L.tileLayer("https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png",{attribution:"&copy; OpenStreetMap contributors, HOT"});a.addTo(t);const o={OpenStreetMap:a,"OSM HOT":r};L.control.layers(o,{}).addTo(t),this.map=t,t.on("click",s=>{const i=document.getElementById("lat"),l=document.getElementById("lon");i&&l&&(i.value=s.latlng.lat,l.value=s.latlng.lng)})}},100)}async loadStories(){try{const e=await F({withLocation:!0});if(e.error){console.error("Error fetching stories:",e.message);return}const t=e.listStory||[];this.stories=t,this.displayStoriesList(t),this.addMarkersToMap(t);const a=document.getElementById("filter-input");a&&a.addEventListener("input",()=>{const r=a.value.toLowerCase(),o=this.stories.filter(s=>(s.description||"").toLowerCase().includes(r));this.displayStoriesList(o),this.addMarkersToMap(o)}),this.setupNotificationToggle(),this.loadSavedStories()}catch(e){console.error("Error loading stories:",e)}}displayStoriesList(e){const t=document.getElementById("stories-list");if(t){if(e.length===0){t.innerHTML="<p>No stories found.</p>";return}t.innerHTML=`
      <h2>Stories List</h2>
      <div class="stories-grid">
        ${e.map(a=>`
          <article class="story-card" data-id="${a.id}" tabindex="0" aria-label="Story ${a.name}">
            <img src="${a.photoUrl}" alt="${a.description||"Story photo"}" loading="lazy">
            <div class="story-content">
              <p>${a.description||"No description"}</p>
              <small>By: ${a.name||"Unknown"}</small>
              <small>Created: ${new Date(a.createdAt).toLocaleDateString()}</small>
              <small>Location: ${a.lat}, ${a.lon}</small>
              <div style="margin-top:8px">
                <button class="btn btn-primary save-offline" data-id="${a.id}">Save Offline</button>
              </div>
            </div>
          </article>
        `).join("")}
      </div>
    `,t.querySelectorAll(".story-card").forEach(a=>{a.addEventListener("click",()=>this.focusMarker(a.dataset.id)),a.addEventListener("keydown",r=>{(r.key==="Enter"||r.key===" ")&&(r.preventDefault(),this.focusMarker(a.dataset.id))})}),t.querySelectorAll(".save-offline").forEach(a=>{a.addEventListener("click",()=>{const r=a.dataset.id,o=e.find(s=>s.id===r);o&&this.saveStory(o)})})}}addMarkersToMap(e){if(this.map&&(this.markersLayer?this.markersLayer.clearLayers():this.markersLayer=L.layerGroup().addTo(this.map),this.markersById=new Map,e.forEach(t=>{if(t.lat&&t.lon){const a=L.marker([t.lat,t.lon]).addTo(this.markersLayer);a.bindPopup(`
          <div class="map-popup">
            <img src="${t.photoUrl}" alt="${t.description||"Story photo"}" width="150">
            <p>${t.description||"No description"}</p>
            <small>Created: ${new Date(t.createdAt).toLocaleDateString()}</small>
          </div>
        `),a.on("click",()=>{document.querySelectorAll(".story-card").forEach(r=>{r.classList.remove("highlight"),r.dataset.id===t.id&&(r.classList.add("highlight"),r.scrollIntoView({behavior:"smooth",block:"nearest"}))})}),this.markersById.set(t.id,a)}}),e.some(t=>t.lat&&t.lon))){const t=e.filter(a=>a.lat&&a.lon).map(a=>[a.lat,a.lon]);t.length>0&&this.map.fitBounds(t,{padding:[50,50]})}}focusMarker(e){if(!this.markersById||!this.markersById.has(e))return;const t=this.markersById.get(e);t.openPopup();const a=t.getLatLng();this.map.setView(a,Math.max(this.map.getZoom(),8),{animate:!0}),document.querySelectorAll(".story-card").forEach(r=>{r.classList.toggle("highlight",r.dataset.id===e)})}async saveStory(e){const{saveStoryOffline:t}=await B(async()=>{const{saveStoryOffline:a}=await Promise.resolve().then(()=>C);return{saveStoryOffline:a}},void 0);await t({id:e.id,name:e.name,description:e.description,photoUrl:e.photoUrl,lat:e.lat,lon:e.lon,createdAt:e.createdAt}),this.loadSavedStories()}async loadSavedStories(){const e=document.getElementById("saved-stories");if(!e)return;const{getSavedStories:t,deleteSavedStory:a}=await B(async()=>{const{getSavedStories:o,deleteSavedStory:s}=await Promise.resolve().then(()=>C);return{getSavedStories:o,deleteSavedStory:s}},void 0),r=await t();e.innerHTML=`
      <h2>Saved Stories (Offline)</h2>
      ${r.length===0?"<p>No saved stories.</p>":`
        <div class="stories-grid">
          ${r.map(o=>`
            <article class="story-card" data-id="${o.id}">
              <img src="${o.photoUrl}" alt="${o.description||"Story photo"}" loading="lazy">
              <div class="story-content">
                <p>${o.description||"No description"}</p>
                <small>By: ${o.name||"Unknown"}</small>
                <small>Created: ${new Date(o.createdAt).toLocaleDateString()}</small>
                <small>Location: ${o.lat}, ${o.lon}</small>
                <div style="margin-top:8px">
                  <button class="btn btn-secondary remove-offline" data-id="${o.id}">Remove</button>
                </div>
              </div>
            </article>
          `).join("")}
        </div>
      `}
    `,e.querySelectorAll(".remove-offline").forEach(o=>{o.addEventListener("click",async()=>{await a(o.dataset.id),this.loadSavedStories()})})}async setupNotificationToggle(){const e=document.getElementById("notif-toggle");if(!e)return;const{isSubscribed:t,subscribePush:a,unsubscribePush:r}=await B(async()=>{const{isSubscribed:s,subscribePush:i,unsubscribePush:l}=await import("./push-D8Fem2pE.js");return{isSubscribed:s,subscribePush:i,unsubscribePush:l}},[]),o=async()=>{e.textContent=await t()?"Disable Notifications":"Enable Notifications"};await o(),e.addEventListener("click",async()=>{try{await t()?await r():await a(),await o()}catch(s){alert(s.message||"Notification toggle failed")}})}}class K{async render(){return`
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
    `}async afterRender(){await this.loadLeaflet(),this.initMap();const e=document.getElementById("add-story-form");e&&e.addEventListener("submit",async t=>{t.preventDefault();const a=document.getElementById("description"),r=document.getElementById("photo");document.getElementById("lat"),document.getElementById("lon");const o=document.getElementById("submit-status");["description","photo","lat","lon"].forEach(f=>{const y=document.getElementById(`${f}-error`);y&&(y.textContent="")}),o.textContent="";const s=a.value.trim(),i=r.files[0],l=parseFloat(document.getElementById("lat").value),u=parseFloat(document.getElementById("lon").value);let m=!1;if(s||(document.getElementById("description-error").textContent="Deskripsi wajib diisi",m=!0),i?(i.type.startsWith("image/")||(document.getElementById("photo-error").textContent="File harus berupa gambar",m=!0),i.size>1024*1024&&(document.getElementById("photo-error").textContent="Ukuran gambar maksimal 1MB",m=!0)):(document.getElementById("photo-error").textContent="Foto wajib diunggah",m=!0),isNaN(l)&&(document.getElementById("lat-error").textContent="Pilih lokasi pada peta",m=!0),isNaN(u)&&(document.getElementById("lon-error").textContent="Pilih lokasi pada peta",m=!0),m)return;localStorage.getItem("token")||(o.textContent="Mengirim sebagai tamu (tanpa autentikasi).");try{const f=await M({description:s,photo:i,lat:l,lon:u});if(f.error)throw new Error(f.message||"Gagal menambahkan cerita");o.textContent="Story berhasil ditambahkan!",window.location.hash="#/map"}catch(f){console.warn("Add story gagal, mencoba simpan offline untuk sinkronisasi",f);try{const{savePendingStory:y}=await B(async()=>{const{savePendingStory:x}=await Promise.resolve().then(()=>C);return{savePendingStory:x}},void 0);if(await y({description:s,photo:i,lat:l,lon:u}),o.textContent="Offline: Cerita disimpan dan akan di-sync saat online.","serviceWorker"in navigator&&"SyncManager"in window){const x=await navigator.serviceWorker.ready;try{await x.sync.register("sync-pending-stories")}catch{}}}catch(y){console.error("Gagal menyimpan ke antrian offline",y),o.textContent="Terjadi kesalahan saat menambah story. Coba lagi."}}})}loadLeaflet(){return new Promise((e,t)=>{if(window.L){e();return}const a=document.createElement("link");a.rel="stylesheet",a.href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css",document.head.appendChild(a);const r=document.createElement("script");r.src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js",r.onload=e,r.onerror=t,document.body.appendChild(r)})}initMap(){const e=setInterval(()=>{if(window.L){clearInterval(e);const t=L.map("map").setView([0,0],2),a=L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:"&copy; OpenStreetMap contributors"}),r=L.tileLayer("https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png",{attribution:"&copy; OpenStreetMap contributors, HOT"});a.addTo(t),L.control.layers({OpenStreetMap:a,"OSM HOT":r},{}).addTo(t),this.map=t,t.on("click",o=>{const s=document.getElementById("lat"),i=document.getElementById("lon");s&&i&&(s.value=o.latlng.lat.toFixed(6),i.value=o.latlng.lng.toFixed(6),this.marker?this.marker.setLatLng(o.latlng):(this.marker=L.marker(o.latlng,{draggable:!0}).addTo(t),this.marker.on("dragend",l=>{const u=l.target.getLatLng();s.value=u.lat.toFixed(6),i.value=u.lng.toFixed(6)})))})}},100)}}const Q={"/":new q,"/about":new U,"/login":new G,"/register":new V,"/map":new J,"/add-story":new K};function Z(n){const e=n.split("/");return{resource:e[1]||null,id:e[2]||null}}function X(n){let e="";return n.resource&&(e=e.concat(`/${n.resource}`)),n.id&&(e=e.concat("/:id")),e||"/"}function ee(){return location.hash.replace("#","")||"/"}function te(){const n=ee(),e=Z(n);return X(e)}var w,v,p,c,_,R,b,$;class re{constructor({navigationDrawer:e,drawerButton:t,content:a}){E(this,c);E(this,w,null);E(this,v,null);E(this,p,null);P(this,w,a),P(this,v,t),P(this,p,e),g(this,c,_).call(this),g(this,c,R).call(this)}async renderPage(){const e=te(),t=Q[e];if(g(this,c,$).call(this,e)&&!localStorage.getItem("token")){window.location.hash="#/login";return}document.startViewTransition?await document.startViewTransition(async()=>{d(this,w).innerHTML=await t.render(),await t.afterRender(),g(this,c,b).call(this)}).ready:(d(this,w).innerHTML=await t.render(),await t.afterRender(),g(this,c,b).call(this))}}w=new WeakMap,v=new WeakMap,p=new WeakMap,c=new WeakSet,_=function(){d(this,v).addEventListener("click",()=>{d(this,p).classList.toggle("open");const e=d(this,p).classList.contains("open");d(this,v).setAttribute("aria-expanded",e?"true":"false")}),document.body.addEventListener("click",e=>{!d(this,p).contains(e.target)&&!d(this,v).contains(e.target)&&d(this,p).classList.remove("open"),d(this,p).querySelectorAll("a").forEach(t=>{t.contains(e.target)&&(d(this,p).classList.remove("open"),d(this,v).setAttribute("aria-expanded","false"))})})},R=function(){g(this,c,b).call(this),window.addEventListener("storage",e=>{e.key==="token"&&g(this,c,b).call(this)})},b=function(){const e=document.getElementById("auth-links"),t=localStorage.getItem("token");if(e)if(t){e.innerHTML='<a href="#/" id="logout-link">Logout</a>';const a=document.getElementById("logout-link");a&&a.addEventListener("click",r=>{r.preventDefault(),localStorage.removeItem("token"),g(this,c,b).call(this),window.location.hash="#/"})}else e.innerHTML=`
          <a href="#/login">Login</a>
          <a href="#/register">Register</a>
        `},$=function(e){return["/add-story","/map"].includes(e)};const ae="stories-app-db",oe=1;function S(){return new Promise((n,e)=>{const t=indexedDB.open(ae,oe);t.onupgradeneeded=a=>{const r=a.target.result;r.objectStoreNames.contains("savedStories")||r.createObjectStore("savedStories",{keyPath:"id"}),r.objectStoreNames.contains("pendingStories")||r.createObjectStore("pendingStories",{keyPath:"id",autoIncrement:!0})},t.onsuccess=()=>n(t.result),t.onerror=()=>e(t.error)})}async function ne(n){const e=await S();return new Promise((t,a)=>{const r=e.transaction("savedStories","readwrite");r.objectStore("savedStories").put(n),r.oncomplete=()=>t(!0),r.onerror=()=>a(r.error)})}async function se(){const n=await S();return new Promise((e,t)=>{const r=n.transaction("savedStories","readonly").objectStore("savedStories").getAll();r.onsuccess=()=>e(r.result||[]),r.onerror=()=>t(r.error)})}async function ie(n){const e=await S();return new Promise((t,a)=>{const r=e.transaction("savedStories","readwrite");r.objectStore("savedStories").delete(n),r.oncomplete=()=>t(!0),r.onerror=()=>a(r.error)})}async function le(n){const e=await S();return new Promise((t,a)=>{const o=e.transaction("pendingStories","readwrite").objectStore("pendingStories").add(n);o.onsuccess=()=>t(o.result),o.onerror=()=>a(o.error)})}async function N(){const n=await S();return new Promise((e,t)=>{const r=n.transaction("pendingStories","readonly").objectStore("pendingStories").getAll();r.onsuccess=()=>e(r.result||[]),r.onerror=()=>t(r.error)})}async function j(n){const e=await S();return new Promise((t,a)=>{const r=e.transaction("pendingStories","readwrite");r.objectStore("pendingStories").delete(n),r.oncomplete=()=>t(!0),r.onerror=()=>a(r.error)})}const C=Object.freeze(Object.defineProperty({__proto__:null,deletePendingStory:j,deleteSavedStory:ie,getPendingStories:N,getSavedStories:se,savePendingStory:le,saveStoryOffline:ne},Symbol.toStringTag,{value:"Module"}));async function D(){try{const n=await N();for(const e of n)try{(await M({description:e.description,photo:e.photo,lat:e.lat,lon:e.lon})).error||await j(e.id)}catch(t){console.warn("Failed to sync pending story",e.id,t)}}catch(n){console.error("Process pending stories error",n)}}document.addEventListener("DOMContentLoaded",async()=>{var a;const n=new re({content:document.querySelector("#main-content"),drawerButton:document.querySelector("#drawer-button"),navigationDrawer:document.querySelector("#navigation-drawer")});if(await n.renderPage(),window.addEventListener("hashchange",async()=>{await n.renderPage()}),"serviceWorker"in navigator)try{await navigator.serviceWorker.register("/sw.js")}catch(r){console.error("SW registration failed",r)}let e=null;const t=document.getElementById("install-button");window.addEventListener("beforeinstallprompt",r=>{r.preventDefault(),e=r,t&&(t.style.display="inline-block")}),t&&t.addEventListener("click",async()=>{if(!e)return;e.prompt();const r=await e.userChoice;e=null,t.style.display="none",console.log("Install choice",r)}),window.addEventListener("online",async()=>{await D()}),(a=navigator.serviceWorker)==null||a.addEventListener("message",async r=>{var o;((o=r.data)==null?void 0:o.type)==="SYNC_PENDING_STORIES"&&await D()})});export{k as C};
