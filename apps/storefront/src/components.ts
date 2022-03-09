export const componentsMapping = {
  'storefront-component': {
    name: 'storefront-component',
    component: () => import('./storefront.component'),
  },
  'oryx-banner': {
    name: 'oryx-banner',
    component: () => import('@spryker-oryx/content/banner'),
  },
  ProductsList: {
    name: 'ProductsList',
  },
  Banner: {
    name: 'Banner',
  },
  'my-element': {
    name: 'my-element',
  },
  BannerEB: {
    name: 'BannerEB',
  },
  'wc-banner': {
    name: 'wc-banner',
  },
};
