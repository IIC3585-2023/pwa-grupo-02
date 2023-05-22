import { initializeApp } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js";
import { getMessaging, getToken, onMessage } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-messaging.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAdaGRnS1LKjPFniQi3avBXR61lT8MU_8E",
    authDomain: "tarea-4-pwa.firebaseapp.com",
    projectId: "tarea-4-pwa",
    storageBucket: "tarea-4-pwa.appspot.com",
    messagingSenderId: "947319126161",
    appId: "1:947319126161:web:58729716709846e5636730"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

const listen = async () => {
  try {
    const serviceWorkerRegistration = await navigator.serviceWorker.register('./firebase/firebase-messaging-sw.js');
    let token = localStorage.getItem('token')
    // Get token only if it does not exist in local storage
    if (token === null) {
      token = await getToken(messaging, {
        vapidKey: "BNLTyeN4Td94qy9BSjEPUu34ttW30qsIJgYeilyYBLM8mQpc_u66BQj25edCo2Nd-WF-dtAWnQmdLTLE7-F-qbw",
        serviceWorkerRegistration,
      });
      localStorage.setItem('token', token);
    //   await fetch('https://backend-pwa-g5.onrender.com/subscribe', {
    //     method: 'POST',
    //     body: JSON.stringify({ token }),
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //   });
    }
    console.log(token);
    onMessage(messaging, ({notification}) => {
      // console.log('Message received. ', payload);
      console.log('Message received. ', notification)
      const {title, body } = notification;
      serviceWorkerRegistration.showNotification(title, {
        body,
      });
      const not = new Notification(title, { body }).onshow = () => {
        console.log('Notificacion mostrada');
        };
      console.log(not)
    });
    console.log("Notificaciones soportadas");
  } catch (e) {
    console.log('ERROR: ', e)
    console.log("Notificaciones no soportadas");
  } 
}; 
listen();