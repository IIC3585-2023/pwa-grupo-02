'use strict';

window.addEventListener('load', async e => {
  await fetchTrending();
  if ('serviceWorker' in navigator) {
    try {
        await navigator.serviceWorker.register('serviceWorker.js');
        console.log('Service worker active');
        await navigator.serviceWorker.register('firebase/firebase-messaging-sw.js')
        console.log('Service worker active 2');
    } catch (error) {
        console.log('SW failed');
    }
  }
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
const matches = document.querySelector('.matches');
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
  if (window.location.href.includes('index')) {
  const user = data[index];
  const html = `
    <div class="card">
      <div class="user">
        <img class="user" src="${user.img_urls[0]}" alt="${user.firstName}" />
        <div class="profile">
          <div class="name">${user.firstName} ${user.lastName}</div>
          <div class="local">
            <i class="fas fa-map-marker-alt"></i>
            <span>a ${(Math.random() * 21).toFixed(1)} kilómetros de distancia</span>
          </div>
        </div>
      </div>
    </div>
  `;

  container.innerHTML = html;
  }
}


// // Función para renderizar las líneas de los matches
// function renderDataLines(data) {
//   console.log('renderDataLines', data);
//   if (window.location.href.includes('messages')) {
//     let html = '';

//     for (let i = 0; i < data.length; i++) {
//       const user = data[i];

//       html += `
//       <div class="messages">
//         <div class="avatar">
//           <img src="${user.img_urls[0]}" alt="${user.firstName}" />
//         </div>
//         <div class="message">
//           <div class="user">${user.firstName} ${user.lastName}</div>
//           <div class="text">Lorem ipsum dolor sit amet consectetur adipisicing</div>
//         </div>
//       </div>
//       `;
//     }

//     matches.innerHTML = html;
//   }
// }

// Función para renderizar la siguiente tarjeta de usuario
function renderNextUserCard() {
  currentIndex++;
  if (currentIndex < data.length) {
    renderUserCard(currentIndex);
  } else {
    console.log('No hay más usuarios');
  }
}

document.getElementById("messages").addEventListener("click", function(event) {
  event.preventDefault(); // Evita que se siga la URL del enlace
  
  // Redirige a messages.html
  window.location.href = "messages.html";
});

document.getElementById("index").addEventListener("click", function(event) {
  event.preventDefault(); // Evita que se siga la URL del enlace
  
  // Redirige a messages.html
  window.location.href = "index.html";
});


async function toggleMenu() {
  var navbarMenu = document.getElementById("navbar-menu");
  if (navbarMenu.style.display === "block") {
    navbarMenu.style.display = "none";
  } else {
    navbarMenu.style.display = "block";
  }
}

document.getElementById("toggleButton").addEventListener("click", toggleMenu);
