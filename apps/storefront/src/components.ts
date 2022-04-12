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
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    component: () => import('@spryker-oryx/content/banner'),
    template: (uid) => html`<oryx-banner uid="${uid}"></oryx-banner>`,
  },
  'product-title': {
    name: 'product-title',
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    component: () => import('@spryker-oryx/product/title'),
    template: (uid: string) =>
      html`<product-title uid="${uid}"></product-title>`,
  },
};
