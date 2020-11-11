/* eslint-disable no-restricted-globals */
// eslint-disable-next-line no-unused-vars
let getVersionPort;
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'INIT_PORT') {
    // eslint-disable-next-line prefer-destructuring
    getVersionPort = event.ports[0];
  }
});

self.addEventListener('notificationclick', (e) => {
  e.waitUntil(self.clients.openWindow('/alerts'));
});

self.addEventListener('push', async (event) => {
  const data = event.data.json();
  // console.log('New notification', data);
  const { title } = data;
  if (getVersionPort) {
    getVersionPort.postMessage({ payload: data });
  }
  const options = {
    body: data.body,
    icon: '/logo.png',
    badge: '/logo.png',
    tag: 'vibration-sample',
    click_action: window ? `${window.location.href}alerts` : '',
    timeout: 2000,
  };
  const notificationPromise = self.registration.showNotification(title, options);
  event.waitUntil(notificationPromise);
});
