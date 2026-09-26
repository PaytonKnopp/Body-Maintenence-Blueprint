/* The Blueprint — service worker: lets the home-screen app open with no signal.
   The page itself is fetched fresh whenever the network answers quickly, so updates
   show up on the next launch; everything else is served from cache.
   Bump VERSION when fonts or icons change. */
const VERSION = 'blueprint-v2';
const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/icon.svg',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon.png',
  './icons/favicon-32.png',
  './fonts/oswald.woff2',
  './fonts/inter.woff2',
  './fonts/jetbrains-mono.woff2'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

/* Network first for the page (with a short timeout so a weak gym signal doesn't hang the launch) */
function pageFirst(req) {
  return caches.open(VERSION).then(cache => {
    const net = fetch(req).then(res => {
      if (res.ok) cache.put('./index.html', res.clone());
      return res;
    });
    const timeout = new Promise(resolve => setTimeout(resolve, 3000));
    return Promise.race([net, timeout.then(() => cache.match('./index.html'))])
      .then(res => res || net)
      .catch(() => cache.match('./index.html'));
  });
}

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;
  if (req.mode === 'navigate') { e.respondWith(pageFirst(req)); return; }
  e.respondWith(
    caches.match(req, { ignoreSearch: true }).then(hit => hit || fetch(req).then(res => {
      if (res.ok) { const copy = res.clone(); caches.open(VERSION).then(c => c.put(req, copy)); }
      return res;
    }))
  );
});
