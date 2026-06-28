const CACHE    = "tradepro-v2";
const API_URL  = "/api/";
const FONT_URL = "https://fonts.googleapis.com";

const PRECACHE = [
  "/",
  "/manifest.json",
  "https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&display=swap",
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE).then(c => {
      return Promise.allSettled(PRECACHE.map(url => c.add(url).catch(() => {})));
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (e) => {
  const { request } = e;
  const url = new URL(request.url);

  if (url.pathname.startsWith(API_URL)) {
    e.respondWith(
      fetch(request).catch(() =>
        new Response(JSON.stringify({ status: "offline", error: "No network" }), {
          headers: { "Content-Type": "application/json" },
        })
      )
    );
    return;
  }

  if (url.origin === "https://fonts.googleapis.com" || url.origin === "https://fonts.gstatic.com") {
    e.respondWith(
      caches.match(request).then(cached => cached || fetch(request).then(res => {
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(request, clone));
        return res;
      }))
    );
    return;
  }

  e.respondWith(
    fetch(request)
      .then(res => {
        if (res.ok && request.method === "GET") {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(request, clone));
        }
        return res;
      })
      .catch(() => caches.match(request).then(cached => cached ||
        new Response("Offline", { status: 503, statusText: "Service Unavailable" })
      ))
  );
});

self.addEventListener("sync", (e) => {
  if (e.tag === "tradepro-sync") {
    e.waitUntil(
      self.clients.matchAll().then(clients =>
        clients.forEach(c => c.postMessage({ type: "BACKGROUND_SYNC" }))
      )
    );
  }
});

self.addEventListener("push", (e) => {
  if (!e.data) return;
  try {
    const data = e.data.json();
    e.waitUntil(
      self.registration.showNotification(data.title || "TradePro", {
        body: data.body || "",
        icon: "/icons/icon-192.png",
        badge: "/icons/icon-72.png",
        dir: "rtl",
        lang: "ar",
        data: { url: data.url || "/" },
      })
    );
  } catch {}
});

self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  const url = e.notification.data?.url || "/";
  e.waitUntil(clients.openWindow(url));
});
