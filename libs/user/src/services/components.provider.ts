import { ComponentMapping } from '@spryker-oryx/experience';
import { Provider } from '@spryker-oryx/injector';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';

export const componentsProvider: Provider = {
  provide: ComponentMapping,
  useValue: {
    ['address-list']: {
      template: (uid: string, layoutClasses?: string) =>
        html`<oryx-address-list
          uid="${uid}"
          class=${ifDefined(layoutClasses)}
        ></oryx-address-list>`,
    },
  },
};
