// discordia: recebe as notificações (push) mesmo com o site fechado
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", e => e.waitUntil(self.clients.claim()));

self.addEventListener("push", e => {
  const d = e.data ? e.data.json() : {};
  e.waitUntil(self.registration.showNotification(d.titulo || "discordia", {
    body: d.corpo || "",
    icon: d.icone || "icone-192.png",
    badge: "icone-badge.png",
    tag: d.tag, renotify: true,
    data: { url: d.url, canal: d.canal },
  }));
});

// tocou na notificação: abre (ou traz pra frente) o discordia no canal certo
self.addEventListener("notificationclick", e => {
  e.notification.close();
  const { url, canal } = e.notification.data || {};
  e.waitUntil((async () => {
    const abas = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
    const aba = abas.find(c => c.url.startsWith(self.registration.scope));
    if (aba) { await aba.focus(); aba.postMessage({ abrirCanal: canal }); return; }
    await self.clients.openWindow(url || self.registration.scope);
  })());
});
