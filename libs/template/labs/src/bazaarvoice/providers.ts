import { Provider } from '@spryker-oryx/di';
import { ComponentMapping } from '@spryker-oryx/experience';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';

export const bazaarVoiceComponentMapping: Provider = {
  provide: ComponentMapping,
  useValue: {
    ['bv-product-average-rating']: {
      template: (uid: string, layoutClasses?: string) =>
        html`<bv-product-average-rating
          uid="${uid}"
          class=${ifDefined(layoutClasses)}
        ></bv-product-average-rating>`,
    },

    ['bv-product-review-list']: {
      template: (uid: string, layoutClasses?: string) =>
        html`<bv-product-review-list
          uid="${uid}"
          class=${ifDefined(layoutClasses)}
        ></bv-product-review-list>`,
    },
  },
};
