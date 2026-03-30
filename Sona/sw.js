const CACHE = "sona-v1";
const ASSETS = ["/Sona/", "/Sona/index.html"];

self.addEventListener("install", function(e){
  e.waitUntil(caches.open(CACHE).then(function(c){ return c.addAll(ASSETS); }));
  self.skipWaiting();
});

self.addEventListener("activate", function(e){
  e.waitUntil(caches.keys().then(function(keys){
    return Promise.all(keys.filter(function(k){ return k!==CACHE; }).map(function(k){ return caches.delete(k); }));
  }));
  self.clients.claim();
});

self.addEventListener("fetch", function(e){
  // Network first for API calls, cache first for assets
  if(e.request.url.indexOf("ticketmaster")>=0 || e.request.url.indexOf("anthropic")>=0 || e.request.url.indexOf("spotify")>=0){
    e.respondWith(fetch(e.request).catch(function(){ return caches.match(e.request); }));
  } else {
    e.respondWith(caches.match(e.request).then(function(r){ return r || fetch(e.request); }));
  }
});
