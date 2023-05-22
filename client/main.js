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
    const serviceWorkerRegistration = await navigator.serviceWorker.register('firebase-messaging-sw.js');
    let token = localStorage.getItem('token')
    // Get token only if it does not exist in local storage
    if (token === null) {
      token = await getToken(messaging, {
        vapidKey: "BNLTyeN4Td94qy9BSjEPUu34ttW30qsIJgYeilyYBLM8mQpc_u66BQj25edCo2Nd-WF-dtAWnQmdLTLE7-F-qbw",
        serviceWorkerRegistration,
      });
      localStorage.setItem('token', token);
    }
    await fetch('https://pwa-sw05.onrender.com/users/1/token', {
        method: 'POST',
        body: JSON.stringify({ token }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
    console.log(token);
    onMessage(messaging, ({notification}) => {
      // console.log('Message received. ', payload);
      console.log('Message received. ', notification)
      const {title, body } = notification;
      serviceWorkerRegistration.showNotification(title, {
        body,
      });
    });
    console.log("Notificaciones soportadas");
  } catch (e) {
    console.log('ERROR: ', e)
    console.log("Notificaciones no soportadas");
  } 
}; 


window.addEventListener('load', async e => {
  if ('serviceWorker' in navigator) {
    try {
        await listen();
        console.log('Fire base SW active');
    } catch (error) {
        console.log('SW failed');
    }
  }
  await fetchTrending();
});

let data = []; // Variable para almacenar los datos obtenidos

async function fetchTrending() {
  const cache = await caches.open('tinder');
  const request = 'https://pwa-sw05.onrender.com/users/1/people'
  try {
    const res = await fetch(request, {
      method: 'GET',
    });
    data = await res.json();
    cache.put(request, res.clone());
  } catch (error) {
    const res = await cache.match(request);
    data = await res.json();
  }
  renderUserCard(0); // Renderizar la primera tarjeta de usuario
}

async function sendLike(id, isRejection) {
  const res = await fetch(`https://pwa-sw05.onrender.com/users/1/likes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ likedUserId: id, isRejection }),
  });
  const data = await res.json();
  console.log(data);
}

// Obtener referencias a los elementos del DOM
const container = document.querySelector('.container');
const buttonsDiv = document.getElementsByClassName('buttons')[0];

// Agregar eventos de clic a los botones de "X" y "corazón"
buttonsDiv.addEventListener('click', handleButtonClick);

// Variable para almacenar el índice del usuario actual
let currentIndex = 0;

// Función para manejar los clics en los botones de "X" y "corazón"
async function handleButtonClick(event) {
  const target = event.target;
 if (target.classList.contains('fa-times') || target.classList.contains('no')) {    // Acción cuando se hace clic en el botón "X"
    await sendLike(data[currentIndex].id, true);
    renderNextUserCard();
  } else if (target.classList.contains('fa-star') || target.classList.contains('star')) {
    // Acción cuando se hace clic en el botón "corazón"
    await sendLike(data[currentIndex].id, false);
    renderNextUserCard();
  } else if (target.classList.contains('fa-heart') || target.classList.contains('heart')) {
    // Acción cuando se hace clic en el botón "corazón"
    await sendLike(data[currentIndex].id, false);
    renderNextUserCard();
  }
}

// Función para renderizar la tarjeta de usuario actual en el DOM
function renderUserCard(index) {
  const user = data[index];
  const html = `
    <div class="card">
      <div class="user">
        <img class="user" src="${user.img_urls[0]}" alt="${user.firstName}" />
        <div class="profile">
          <div class="name">${user.firstName} ${user.lastName}</div>
          <div class="local">
            <i class="fas fa-map-marker-alt"></i>
            <span>a 20 kilómetros desde aquí</span>
          </div>
        </div>
      </div>
    </div>
  `;

  container.innerHTML = html;
}

// Función para renderizar la siguiente tarjeta de usuario
function renderNextUserCard() {
  currentIndex++;
  if (currentIndex < data.length) {
    renderUserCard(currentIndex);
  } else {
    console.log('No hay más usuarios');
  }
}

Notification.requestPermission().then((permission) => {
  if (permission === 'granted') {
    console.log('Notification permission granted.');
  }
});