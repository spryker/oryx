/// <reference lib="WebWorker" />

// Stub window because lit it's not tree-shakeable and not compatible with service workers
import '@spryker-oryx/utilities/window-stub';

import { clientsClaim } from 'workbox-core';
import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching';

declare let self: ServiceWorkerGlobalScope;

export const bootstrap = (): void => {
  cleanupOutdatedCaches();
  precacheAndRoute(self.__WB_MANIFEST ?? []);
  skipWaiting();
  clientsClaim();
};

function skipWaiting() {
  self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
  });
}
