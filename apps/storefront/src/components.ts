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
};
