import { ResourceGraphic } from '@spryker-oryx/experience';

export const fulfillmentResourceGraphics: ResourceGraphic = {
  'image-placeholder': {
    source: () => import('./image-placeholder').then((m) => m.imagePlaceholder),
  },
  'no-orders': {
    source: () => import('./no-orders').then((m) => m.noOrders),
  },
  'no-search-results': {
    source: () => import('./no-search-results').then((m) => m.noSearchResults),
  },
  'picking-items-processed': {
    source: () =>
      import('./picking-items-processed').then((m) => m.pickingItemsProcessed),
  },
  searching: {
    source: () => import('./searching').then((m) => m.searching),
  },
  'user-note': {
    source: () => import('./user-note').then((m) => m.userNote),
  },
};
