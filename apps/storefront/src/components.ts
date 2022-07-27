import { html, TemplateResult } from 'lit';
export interface ComponentMapping {
  tag: string;
  component?: () => void;
  template?: (uid: string) => TemplateResult;
}

export interface ComponentsMapping {
  [wildcard: string]: ComponentMapping;
}

export const componentsMapping: ComponentsMapping = {
  'experience-composition': {
    tag: 'experience-composition',
    component: () => import('@spryker-oryx/experience/components'),
    template: (uid: string) =>
      html`<experience-composition uid="${uid}"></experience-composition>`,
  },
  'oryx-banner': {
    tag: 'oryx-banner',
    component: () => import('@spryker-oryx/content/banner'),
    template: (uid: string) => html`<oryx-banner uid="${uid}"></oryx-banner>`,
  },
  'oryx-link': {
    tag: 'oryx-link',
    component: () => import('@spryker-oryx/ui/link'),
    template: (uid: string) => html`<oryx-link uid="${uid}"></oryx-link>`,
  },
  'product-title': {
    tag: 'product-title',
    component: () => import('@spryker-oryx/product/title'),
    template: (uid: string) =>
      html`<product-title uid="${uid}"></product-title>`,
  },
  'product-images': {
    tag: 'product-images',
    component: () => import('@spryker-oryx/product/images'),
    template: (uid: string) =>
      html`<product-images uid="${uid}"></product-images>`,
  },
  'content-link': {
    tag: 'content-link',
    component: () => import('@spryker-oryx/content/link'),
    template: (uid: string) => html`<content-link uid="${uid}"></content-link>`,
  },
  'product-price': {
    tag: 'product-price',
    component: () => import('@spryker-oryx/product/price'),
    template: (uid: string) =>
      html`<product-price uid="${uid}"></product-price>`,
  },
  'product-description': {
    tag: 'product-description',
    component: () => import('@spryker-oryx/product/description'),
    template: (uid: string) =>
      html`<product-description uid="${uid}"></product-description>`,
  },
  'product-average-rating': {
    tag: 'product-average-rating',
    component: () => import('@spryker-oryx/product/average-rating'),
    template: (uid: string) =>
      html`<product-average-rating uid="${uid}"></product-average-rating>`,
  },
  'product-media': {
    tag: 'product-media',
    component: () => import('@spryker-oryx/product/media'),
    template: (uid: string) =>
      html`<product-media uid="${uid}"></product-media>`,
  },
  'user-login': {
    tag: 'user-login',
    component: () => import('@spryker-oryx/user/login'),
    template: (uid: string) => html`<user-login uid="${uid}"></user-login>`,
  },
  'product-id': {
    tag: 'product-id',
    component: () => import('@spryker-oryx/product/id'),
    template: (uid: string) => html`<product-id uid="${uid}"></product-id>`,
  },
  'add-to-cart': {
    tag: 'add-to-cart',
    component: () => import('@spryker-oryx/cart/add-to-cart'),
    template: (uid: string) => html`<add-to-cart uid="${uid}"></add-to-cart>`,
  },
  'product-card': {
    tag: 'product-card',
    component: () => import('@spryker-oryx/product/card'),
    template: (uid: string) => html`<product-card uid="${uid}"></product-card>`,
  },
  'product-attributes': {
    tag: 'product-attributes',
    component: () => import('@spryker-oryx/product/attributes'),
    template: (uid: string) =>
      html`<product-attributes uid="${uid}"></product-attributes>`,
  },
  'mini-cart': {
    tag: 'add-to-cart',
    component: () => import('@spryker-oryx/cart/mini-cart'),
    template: (uid: string) => html`<mini-cart uid="${uid}"></mini-cart>`,
  },

  'site-searchbox': {
    tag: 'site-searchbox',
    component: async () => {
      await import('@spryker-oryx/site/searchbox');
      await import('@spryker-oryx/ui/image');
      await import('@spryker-oryx/product/media');
      await import('@spryker-oryx/product/price');
    },
    template: (uid: string) =>
      html`<site-searchbox uid="${uid}"></site-searchbox>`,
  },
};
