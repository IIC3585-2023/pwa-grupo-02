if ('serviceWorker' in navigator) {
  try {
      const registration = navigator.serviceWorker.register('serviceWorker.js', {scope: './'});
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
window.addEventListener('load', async e => {
  await fetchTrending();
  });

async function fetchTrending() {
  const res = await fetch(`http://localhost:3000/users`, {
    method: 'GET',
  });
  const data = await res.json();
  console.log(data);
  const container = document.querySelector('.container');
  data.forEach(user => {
    const div = document.createElement('div');
    div.classList.add('card');
    div.innerHTML = `
    <img src="${user.img_urls[0]}" alt="${user.firstName}" />
    <h3>${user.lastName}</h3>
    <p>${user.email}</p>
    `;
    container.appendChild(div);
  });
  }
