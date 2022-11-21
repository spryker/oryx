import { ComponentMapping } from '@spryker-oryx/experience';
import { Provider } from '@spryker-oryx/injector';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';

export const componentsProvider: Provider = {
  provide: ComponentMapping,
  useValue: {
    ['site-notification-center']: {
      template: (uid: string, layoutClasses?: string) =>
        html`<site-notification-center
          uid="${uid}"
          class=${ifDefined(layoutClasses)}
        ></site-notification-center>`,
    },
  },
};
