import { Provider } from '@spryker-oryx/di';
import { ComponentMapping } from '@spryker-oryx/experience';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';

export const componentsProvider: Provider = {
  provide: ComponentMapping,
  useValue: {
    ['checkout-link']: {
      template: (uid: string, layoutClasses?: string) =>
        html`<checkout-link
          uid="${uid}"
          class=${ifDefined(layoutClasses)}
        ></checkout-link>`,
    },
    ['checkout-guest']: {
      template: (uid: string, layoutClasses?: string) =>
        html`<checkout-guest
          uid="${uid}"
          class=${ifDefined(layoutClasses)}
        ></checkout-guest>`,
    },
    ['checkout-auth']: {
      template: (uid: string, layoutClasses?: string) =>
        html`<checkout-auth
          uid="${uid}"
          class=${ifDefined(layoutClasses)}
        ></checkout-auth>`,
    },
    ['checkout-shipment']: {
      template: (uid: string, layoutClasses?: string) =>
        html`<checkout-shipment
          uid="${uid}"
          class=${ifDefined(layoutClasses)}
        ></checkout-shipment>`,
    },
    ['checkout-payment']: {
      template: (uid: string, layoutClasses?: string) =>
        html`<checkout-payment
          uid="${uid}"
          class=${ifDefined(layoutClasses)}
        ></checkout-payment>`,
    },
    ['checkout-place-order']: {
      template: (uid: string, layoutClasses?: string) =>
        html`<checkout-place-order
          uid="${uid}"
          class=${ifDefined(layoutClasses)}
        ></checkout-place-order>`,
    },
    ['oryx-checkout-composition']: {
      template: (uid: string, layoutClasses?: string) =>
        html`<oryx-checkout-composition
          uid="${uid}"
          class=${ifDefined(layoutClasses)}
        ></oryx-checkout-composition>`,
    },
  },
};
