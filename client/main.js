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

