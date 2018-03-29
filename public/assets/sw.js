// var cacheName = 'desikate-sea-40976';

// var filesToCache = [
    // 'assets/custom',
    // 'assets/materialize',
    // 'assets/particlesjs',
    // 'assets/slick/slick',
    // 'img/aboutfire.jpg',
    // 'img/aboutmain.jpg',
    // 'img/background.png',
    // 'img/citytopview.jpg',
    // 'img/cover.jpg',
    // 'img/favicon.ico',
    // 'img/iamvocal1.png',
    // 'img/iamvocal2.png',
    // 'img/iamvocal3.png',
    // 'img/iamvocal4.png',
    // './images/profile.png',
    // './images/push-off.png',
    // './images/push-on.png',
    // './js/app.js',
    // './js/menu.js',
    // './js/offline.js',
    // './js/toast.js'
// ];

// // Install Service Worker
// self.addEventListener('install', function(event) {

//     console.log('Service Worker: Installing....');

//     event.waitUntil(

//         // Open the Cache
//         caches.open(cacheName).then(function(cache) {
//             console.log('Service Worker: Caching App Shell at the moment......');

//             // Add Files to the Cache
//             return cache.addAll(filesToCache);
//         })
//     );
// });


// // Fired when the Service Worker starts up
// self.addEventListener('activate', function(event) {

//     console.log('Service Worker: Activating....');

//     event.waitUntil(
//         caches.keys().then(function(cacheNames) {
//             return Promise.all(cacheNames.map(function(key) {
//                 if( key !== cacheName) {
//                     console.log('Service Worker: Removing Old Cache', key);
//                     return caches.delete(key);
//                 }
//             }));
//         })
//     );
//     return self.clients.claim();
// });


// self.addEventListener('fetch', function(event) {

//     console.log('Service Worker: Fetch', event.request.url);

//     console.log("Url", event.request.url);

//     event.respondWith(
//         caches.match(event.request).then(function(response) {
//             return response || fetch(event.request);
//         })
//     );
// });
var cacheName = 'pwa-commits-v3';

var filesToCache = [
	'/',
	'../../views/index.ejs',
     'custom/style.css',
    'materialize/materialize/css/materialize.css',
    'materialize/materialize/js/materialize.js',
];

// Install Service Worker
self.addEventListener('install', function(event) {

    console.log('Service Worker: Installing....');

    event.waitUntil(

        // Open the Cache
        caches.open(cacheName).then(function(cache) {
            console.log('Service Worker: Caching App Shell at the moment......');

            // Add Files to the Cache
            return cache.addAll(filesToCache);
        })
    );
});


// Fired when the Service Worker starts up
self.addEventListener('activate', function(event) {

    console.log('Service Worker: Activating....');

    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(cacheNames.map(function(key) {
                if( key !== cacheName) {
                    console.log('Service Worker: Removing Old Cache', key);
                    return caches.delete(key);
                }
            }));
        })
    );
    return self.clients.claim();
});


self.addEventListener('fetch', function(event) {

    console.log('Service Worker: Fetch', event.request.url);

    console.log("Url", event.request.url);

    event.respondWith(
        caches.match(event.request).then(function(response) {
            return response || fetch(event.request);
        })
    );
});


// // configuration
// const
//   version = '1.0.0',
//   CACHE = version + '::PWAsite',
//   offlineURL = '/offline/',
//   installFilesEssential = [
//     'custom/style.css',
//     'materialize/materialize/css/materialize.css',
//     'materialize/materialize/js/materialize.js',
//     'assets/particlesjs',
//     'assets/slick/slick',
//     'img/aboutfire.jpg',
//     'img/aboutmain.jpg',
//     'img/background.png',
//     'img/citytopview.jpg',
//     'img/cover.jpg',
//     'img/favicon.ico',
//     'img/iamvocal1.png',
//     'img/iamvocal2.png',
//     'img/iamvocal3.png',
//     'img/iamvocal4.png',
//   ].concat(offlineURL),
//   installFilesDesirable = [
//     'custom/style.css',
//     'materialize/materialize/css/materialize.css',
//     'materialize/materialize/js/materialize.js',
//   ];

//   // install static assets
// function installStaticFiles() {

//   return caches.open(CACHE)
//     .then(cache => {

//       // cache desirable files
//       cache.addAll(installFilesDesirable);

//       // cache essential files
//       return cache.addAll(installFilesEssential);

//     });

// }

// // application installation
// self.addEventListener('install', event => {

//   console.log('service worker: install');

//   // cache core files
//   event.waitUntil(
//     installStaticFiles()
//     .then(() => self.skipWaiting())
//   );

// });

// // clear old caches
// function clearOldCaches() {

//   return caches.keys()
//     .then(keylist => {

//       return Promise.all(
//         keylist
//           .filter(key => key !== CACHE)
//           .map(key => caches.delete(key))
//       );

//     });

// }

// // application activated
// self.addEventListener('activate', event => {

//   console.log('service worker: activate');

//     // delete old caches
//   event.waitUntil(
//     clearOldCaches()
//     .then(() => self.clients.claim())
//     );

// });

