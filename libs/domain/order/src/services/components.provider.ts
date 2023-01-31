import { Provider } from '@spryker-oryx/di';
import { ComponentMapping } from '@spryker-oryx/experience';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';

export const componentsProvider: Provider = {
  provide: ComponentMapping,
  useValue: {
    ['oryx-order-confirmation-banner']: {
      template: (uid: string, layoutClasses?: string) =>
        html`<oryx-order-confirmation-banner
          uid="${uid}"
          class=${ifDefined(layoutClasses)}
        ></oryx-order-confirmation-banner>`,
    },
  },
};
