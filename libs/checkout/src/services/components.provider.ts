import { ComponentMapping } from '@spryker-oryx/experience';
import { Provider } from '@spryker-oryx/injector';
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
    ['checkout-login']: {
      template: (uid: string, layoutClasses?: string) =>
        html`<checkout-login
          uid="${uid}"
          class=${ifDefined(layoutClasses)}
        ></checkout-login>`,
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
    ['oryx-checkout-composition']: {
      template: (uid: string, layoutClasses?: string) =>
        html`<oryx-checkout-composition
          uid="${uid}"
          class=${ifDefined(layoutClasses)}
        ></oryx-checkout-composition>`,
    },
  },
};
