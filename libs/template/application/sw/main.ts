/// <reference lib="WebWorker" />

// Stub window because lit it's not tree-shakeable and not compatible with service workers
import '@spryker-oryx/utilities/window-stub';

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

function skipWaiting() {
  self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
      self.skipWaiting();
    }
  });
}
