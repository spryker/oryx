import { Provider } from '@spryker-oryx/di';
import { ComponentMapping } from '@spryker-oryx/experience';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';

export const componentsProvider: Provider = {
  provide: ComponentMapping,
  useValue: {
    ['oryx-cart-add']: {
      template: (uid: string, layoutClasses?: string) =>
        html`<oryx-cart-add
          uid="${uid}"
          class=${ifDefined(layoutClasses)}
        ></oryx-cart-add>`,
    },
    ['oryx-cart-entries']: {
      template: (uid: string, layoutClasses?: string) =>
        html`<oryx-cart-entries
          uid="${uid}"
          class=${ifDefined(layoutClasses)}
        ></oryx-cart-entries>`,
    },
    ['oryx-cart-totals']: {
      template: (uid: string, layoutClasses?: string) =>
        html`<oryx-cart-totals
          uid="${uid}"
          class=${ifDefined(layoutClasses)}
        ></oryx-cart-totals>`,
    },
    ['oryx-cart-summary']: {
      template: (uid: string, layoutClasses?: string) =>
        html`<oryx-cart-summary
          uid="${uid}"
          class=${ifDefined(layoutClasses)}
        ></oryx-cart-summary>`,
    },
  },
};
