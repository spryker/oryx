import { ComponentsMapping } from '@spryker-oryx/experience';
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
  'storefront-component': {
    tag: 'storefront-component',
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    component: () => import('./storefront.component'),
    template: () => html`<storefront-component></storefront-component>`,
  },
  'oryx-banner': {
    tag: 'oryx-banner',
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    component: () => import('@spryker-oryx/content/banner'),
    template: (uid) =>
      html`<oryx-banner componentid="${uid}" uid="${uid}"></oryx-banner>`,
  },
};
