// It's a static script file, so it won't be covered by a module bundling system
// hence, it uses "importScripts" function to load the other libs
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js');

const staticAssets = [
  './',
  './main.js',
  './style.css',
  './public/tinder.png',
];

addEventListener('install', async event => {
  console.log('install event');
  const cache = await caches.open('tinder');
  cache.addAll(staticAssets);
});

addEventListener('fetch', event => {
  console.log(`fetch event for ${event.request.url}`);
  const {request} = event;
  if (request.method !== 'GET') return;
  event.respondWith(networkFirst(request));
});

async function networkFirst(request) {
  const cache = await caches.open('tinder');

  try {
      const response = await fetch(request);
      cache.put(request, response.clone());
      return response;
  } catch (error){
      return await cache.match(request);

  }

}

const firebaseConfig = {
    apiKey: "AIzaSyAdaGRnS1LKjPFniQi3avBXR61lT8MU_8E",
    authDomain: "tarea-4-pwa.firebaseapp.com",
    projectId: "tarea-4-pwa",
    storageBucket: "tarea-4-pwa.appspot.com",
    messagingSenderId: "947319126161",
    appId: "1:947319126161:web:58729716709846e5636730"
  };

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage( ({notification}) => {
      // console.log('Message received. ', payload);
      console.log('Background Message received. ', notification)
      const {title, body } = notification;
      self.registration.showNotification(title, {
        body,
      });

});

console.log("firebase messaging sw")