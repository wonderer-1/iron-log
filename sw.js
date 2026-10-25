// cache the app so it opens offline
const CACHE='ironlog-v7';
const FILES=['./','index.html','manifest.webmanifest','icon-180.png','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));self.clients.claim()});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  // network first so updates show on the next open; cache only when offline
  e.respondWith(caches.open(CACHE).then(c=>fetch(e.request,{cache:'no-store'}).then(res=>{if(res&&res.ok)c.put(e.request,res.clone());return res})
    .catch(()=>c.match(e.request).then(hit=>hit||c.match('index.html')))));
});
