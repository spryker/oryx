export const componentsMapping = {
  'storefront-component': {
    name: 'storefront-component',
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    component: () => import('./storefront.component'),
  },
  'oryx-banner': {
    name: 'oryx-banner',
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
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
