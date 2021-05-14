'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "assets/AssetManifest.json": "e6b8035dfdcdfa2286532253731b756a",
"assets/assets/google_fonts/OFL.txt": "e3a1cc2721b8b8b106d53b45d4e608c0",
"assets/assets/google_fonts/README.txt": "77ef82952125c0e819878c59044da8a4",
"assets/assets/google_fonts/WorkSans-Black.ttf": "1446e4f15dc4b7f83535267c78d35c3c",
"assets/assets/google_fonts/WorkSans-BlackItalic.ttf": "4236a703173354e1c6291e248bfe6f6b",
"assets/assets/google_fonts/WorkSans-Bold.ttf": "a0bf66dd6fc75494a0a51f7662a99c41",
"assets/assets/google_fonts/WorkSans-BoldItalic.ttf": "dbb1fc6dc788cbf11a0659d47ce49ffe",
"assets/assets/google_fonts/WorkSans-Light.ttf": "526a15477e60abaa9e94be1700a7423f",
"assets/assets/google_fonts/WorkSans-LightItalic.ttf": "03014407b8776ee3e9b2f9ece1909904",
"assets/assets/google_fonts/WorkSans-Regular.ttf": "6f916ce8ada5d5facf5ad4e1266a486d",
"assets/assets/init/rikdata_export_config.txt": "a490a8aa0025bd22626a517ceb74d072",
"assets/assets/init/rikdata_export_d365bc_config.txt": "1186a0fd3d1b499e08828fd60c4abb9b",
"assets/assets/init/rikdata_export_d365_config.txt": "7708bb5581ec1b90ffe8bb49e6cd62a6",
"assets/assets/init/rikdata_export_ebs_config.txt": "e03c2918c55422dc7986022339b94a5d",
"assets/assets/init/rikdata_export_local_config.txt": "3d0c7ba24018774cf0f776598c3a171b",
"assets/assets/init/rikdata_export_oracle_config.txt": "3d1cac6f0a2886b4218dd792498b4cbb",
"assets/assets/init/rikdata_export_sap_config.txt": "3fb83e2fc418d0e9378e3ae1a8e59f53",
"assets/assets/init/rikdata_export_snow_config.txt": "00e278fd68230e9b01e0d70dd99537a6",
"assets/FontManifest.json": "dc3d03800ccca4601324923c0b1d6d57",
"assets/fonts/MaterialIcons-Regular.otf": "1288c9e28052e028aba623321f7826ac",
"assets/NOTICES": "9d6ce61a37c8e88c803b6a978c8c5681",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "6d342eb68f170c97609e9da345464e5e",
"favicon.png": "34dbc305675d723bd9c79dd0f64b8901",
"icons/Icon-192.png": "b083984443195a7ca624fa7b79a095f1",
"icons/Icon-512.png": "a8aba57f3bd9b2a6e9e173f227d4fee0",
"index.html": "1d33365a693b789042fcb94671675a2d",
"/": "1d33365a693b789042fcb94671675a2d",
"main.dart.js": "8e3ff5602e12f01c9624e8be657a2fd7",
"manifest.json": "d1d95ae979225d33a891a53e32eb1b74",
"version.json": "889bcc21073e9431c4c8d8f261700972"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "/",
"main.dart.js",
"index.html",
"assets/NOTICES",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value + '?revision=' + RESOURCES[value], {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache.
        return response || fetch(event.request).then((response) => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
