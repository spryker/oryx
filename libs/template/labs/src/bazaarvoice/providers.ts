import { Provider } from '@spryker-oryx/di';
import { ComponentMapping } from '@spryker-oryx/experience';
import { html } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

export const bazaarVoiceComponentMapping: Provider = {
  provide: ComponentMapping,
  useValue: {
    ['bv-product-average-rating']: {
      template: (uid: string, markers?: string) =>
        html`${unsafeHTML(
          `<bv-product-average-rating uid=${uid} ${
            markers ?? ''
          }></bv-product-average-rating>`
        )} `,
    },

    ['bv-product-review-list']: {
      template: (uid: string, markers?: string) =>
        html`${unsafeHTML(
          `<bv-product-review-list uid=${uid} ${
            markers ?? ''
          }></bv-product-review-list>`
        )} `,
    },
  },
};
