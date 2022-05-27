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
  'oryx-banner': {
    tag: 'oryx-banner',
    component: () => import('@spryker-oryx/content/banner'),
    template: (uid: string) => html`<oryx-banner uid="${uid}"></oryx-banner>`,
  },
  'product-title': {
    tag: 'product-title',
    component: () => import('@spryker-oryx/product/title'),
    template: (uid: string) =>
      html`<product-title uid="${uid}"></product-title>`,
  },
  'product-image': {
    tag: 'product-image',
    component: () => import('@spryker-oryx/product/image'),
    template: (uid: string) =>
      html`<product-image uid="${uid}"></product-image>`,
  },
  'product-price': {
    tag: 'product-price',
    component: () => import('@spryker-oryx/product/price'),
    template: (uid: string) =>
      html`<product-price uid="${uid}"></product-price>`,
  },
};
