'use strict';

if ('serviceWorker' in navigator) {
  try {
    const registration = await navigator.serviceWorker.register('serviceWorker.js', { scope: './' });
    if (registration.installing) {
      console.log('Service worker installing');
    } else if (registration.waiting) {
      console.log('Service worker installed');
    } else if (registration.active) {
      console.log('Service worker active');
    }
  } catch (error) {
    console.log('SW failed');
  }
}

window.addEventListener('load', async (e) => {
  await fetchTrending();
});

let data = []; // Variable para almacenar los datos obtenidos

async function fetchTrending() {
  const res = await fetch('http://localhost:3000/users', {
    method: 'GET',
  });
  data = await res.json();
  renderUserCard(0); // Renderizar la primera tarjeta de usuario
}

// Obtener referencias a los elementos del DOM
const container = document.querySelector('.container');
const buttonsDiv = document.getElementsByClassName('buttons')[0];

// Agregar eventos de clic a los botones de "X" y "corazón"
buttonsDiv.addEventListener('click', handleButtonClick);

// Variable para almacenar el índice del usuario actual
let currentIndex = 0;

// Función para manejar los clics en los botones de "X" y "corazón"
function handleButtonClick(event) {
  const target = event.target;
 if (target.classList.contains('fa-times') || target.classList.contains('no')) {    // Acción cuando se hace clic en el botón "X"
    renderNextUserCard();
  } else if (target.classList.contains('fa-star') || target.classList.contains('star')) {
    // Acción cuando se hace clic en el botón "corazón"
    renderNextUserCard();
  } else if (target.classList.contains('fa-heart') || target.classList.contains('heart')) {
    // Acción cuando se hace clic en el botón "corazón"
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
