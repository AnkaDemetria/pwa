const staticCacheName = "cache-v1";
const assets = ["/", "/index.html"]; //on indique la racine impérativement puis la page en cache

// ajout fichiers en cache
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(staticCacheName).then((cache) => {
      cache.addAll(assets);
    })
  );
});
//caches est un objet natif de JS, on en fait une variable et on lui donne un nom "cache v1". Puis on lui dit ce qu'il fait: il ajoute une variable assets

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then(function (response) {
      // Cache hit - return response
      if (response) {
        return response;
      }

      // IMPORTANT: Cloner la requête.
      // Une requete est un flux et est à consommation unique (on utilise1 seule fois et apres on clone sa valeur)
      // Il est donc nécessaire de copier la requete pour pouvoir l'utiliser et la servir
      var fetchRequest = event.request.clone();

      return fetch(fetchRequest).then(function (response) {
        if (!response || response.status !== 200 || response.type !== "basic") {
          return response;
        }

        // IMPORTANT: Même constat qu'au dessus, mais pour la mettre en cache
        var responseToCache = response.clone();

        caches.open(staticCacheName).then(function (cache) {
          cache.put(event.request, responseToCache);
        });

        return response;
      });
    })
  );
});

// supprimer caches: on se prend la clé du cache (cache-v1) et si elle n'est pas réutilisée (clé comparée à staticcachename), on supprime le cache pour ne pas surcharger l'ordi de l'utilisateur qd il revient sur le site
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.add(
        keys
          .filter((key) => key !== staticCacheName)
          .map((key) => caches.delete(key))
      );
    })
  );
});
