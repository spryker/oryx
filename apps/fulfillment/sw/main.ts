/// <reference lib="WebWorker" />

import { clientsClaim } from 'workbox-core';
import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching';
import { app } from './app';

declare let self: ServiceWorkerGlobalScope;

cleanupOutdatedCaches();
precacheAndRoute(self.__WB_MANIFEST ?? []);
skipWaiting();
clientsClaim();

app
  .then(() => console.debug('Service worker app started!'))
  .catch(console.error);

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function skipWaiting() {
  self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
      self.skipWaiting();
    }
  });
}
