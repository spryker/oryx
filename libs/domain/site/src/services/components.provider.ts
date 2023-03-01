import { Provider } from '@spryker-oryx/di';
import { ComponentMapping } from '@spryker-oryx/experience';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';

export const componentsProvider: Provider = {
  provide: ComponentMapping,
  useValue: {
    ['oryx-site-notification-center']: {
      template: (uid: string, layoutClasses?: string) =>
        html`<oryx-site-notification-center
          uid="${uid}"
          class=${ifDefined(layoutClasses)}
        ></oryx-site-notification-center>`,
    },
  },
};
