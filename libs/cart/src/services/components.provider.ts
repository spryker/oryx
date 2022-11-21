import { ComponentMapping } from '@spryker-oryx/experience';
import { Provider } from '@spryker-oryx/injector';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';

export const componentsProvider: Provider = {
  provide: ComponentMapping,
  useValue: {
    ['cart-add']: {
      template: (uid: string, layoutClasses?: string) =>
        html`<oryx-cart-add
          uid="${uid}"
          class=${ifDefined(layoutClasses)}
        ></oryx-cart-add>`,
    },
    ['cart-entries']: {
      template: (uid: string, layoutClasses?: string) =>
        html`<cart-entries
          uid="${uid}"
          class=${ifDefined(layoutClasses)}
        ></cart-entries>`,
    },
    ['cart-totals']: {
      template: (uid: string, layoutClasses?: string) =>
        html`<cart-totals
          uid="${uid}"
          class=${ifDefined(layoutClasses)}
        ></cart-totals>`,
    },
  },
};
