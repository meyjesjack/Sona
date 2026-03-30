const CACHE = "sona-v1";

self.addEventListener("install", function(e){
  self.skipWaiting();
});

self.addEventListener("activate", function(e){
  e.waitUntil(caches.keys().then(function(keys){
    return Promise.all(keys.filter(function(k){ return k!==CACHE; }).map(function(k){ return caches.delete(k); }));
  }));
  self.clients.claim();
});

self.addEventListener("fetch", function(e){
  if(e.request.url.indexOf("ticketmaster")>=0 || e.request.url.indexOf("anthropic")>=0 || e.request.url.indexOf("spotify")>=0){
    return;
  }
  e.respondWith(caches.match(e.request).then(function(r){ return r || fetch(e.request); }));
});
