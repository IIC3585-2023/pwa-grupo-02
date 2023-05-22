// It's a static script file, so it won't be covered by a module bundling system
// hence, it uses "importScripts" function to load the other libs
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js');

// Replace the values with yours
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

console.log("firebase messaging sw")