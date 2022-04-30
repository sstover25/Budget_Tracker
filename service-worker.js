const APP_PREFIX = "BudgetTracker-";
const VERSION = "version_01";
const CACHE_NAME = APP_PREFIX + VERSION;
const FILES_TO_CACHE = [
  "./models/transaction.js",
  "./public/index.html",
  "./public/js/index.js",
  "./public/js/idb.js",
  "./public/css/styles.css",
  "./routes/api.js",
  ".server.js",
];

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      console.log("installing cache: " + CACHE_NAME);
      return cache.addAll(FILES_TO_CACHE);
    })
  );
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (keyList) {
      let cacheKeeplist = keyList.filter(function (key) {
        return key.indexOf(APP_PREFIX);
      });
      cacheKeeplist.push(CACHE_NAME);

      return Promise.all(
        keyList.map(function (key, i) {
          if (cacheKeeplist.indexOf(key) === -1) {
            console.log("deleting cache: " + keyList[i]);
            return caches.delete(keyList[i]);
          }
        })
      );
    })
  );
});

self.addEventListener("fetch", function (event) {
  console.log("fetch request: " + event.request.url);
  event.respondWith(
    caches.match(event.request).then(function (request) {
      if (request) {
        // if cache is available, respond with cache
        console.log("Responding with cache: " + event.request.url);
        return request;
      } else {
        // if there are no cache, try fetching request
        console.log("file is not cached, fetching: " + event.request.url);
        return fetch(event.request);
      }
    })
  );
});
