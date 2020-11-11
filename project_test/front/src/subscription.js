import Api from './store/api';

function urlBase64ToUint8Array(base64String) {
  // eslint-disable-next-line no-mixed-operators
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  // eslint-disable-next-line
    const base64 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/")

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

const convertedVapidKey = urlBase64ToUint8Array(process.env.REACT_APP_PUBLIC_VAPID_KEY);

function sendSubscription(subscription) {
  return Api.post(`${process.env.REACT_APP_API_URL}/users/notifications/subscribe`, { subscription });
}
export const askPermission = () => new Promise(((resolve, reject) => {
  const permissionResult = Notification.requestPermission((result) => {
    resolve(result);
  });

  if (permissionResult) {
    permissionResult.then(resolve, reject);
  }
}))
  .then((permissionResult) => {
    if (permissionResult !== 'granted') {
      // TODO: shwo notification and save notifications status
      console.error('We weren\'t granted permission.');
    }
  });
// eslint-disable-next-line import/prefer-default-export
export function subscribeUser() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then((registration) => {
      if (!registration.pushManager) {
        console.log('Push manager unavailable.');
        return;
      }
      askPermission();
      registration.pushManager.getSubscription().then((existedSubscription) => {
        if (existedSubscription === null) {
          console.log('%c%s %s', 'color: #006dcc', 'No subscription detected, make a request.');
          registration.pushManager.subscribe({
            applicationServerKey: convertedVapidKey,
            userVisibleOnly: true,
          }).then((newSubscription) => {
            console.log('%c%s', 'color: #731d6d', 'New subscription added.');
            sendSubscription(newSubscription);
          }).catch((e) => {
            if (Notification.permission !== 'granted') {
              console.log('%c%s', 'color: #e57373', 'Permission was not granted.');
              askPermission();
            } else {
              console.error('An error ocurred during the subscription process.', e);
            }
          });
        } else {
          console.log('%c%s', 'color: #007300', 'Existed subscription detected.');
          navigator.serviceWorker.ready.then((serviceWorker) => {
            const body = 'you are already subscribed to notification service';
            const options = {
              body,
              icon: '/logo.png',
              badge: '/logo.png',
              tag: 'vibration-sample',
              click_action: `${window.location.href}alerts`,
              timeout: 2000,
            };
            serviceWorker.showNotification('Welcome to THMINSIGHT', options);
          });
        }
      });
    })
      .catch((e) => {
        console.error('An error ocurred during Service Worker registration.', e);
      });
  }
}
