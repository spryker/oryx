import { Provider } from '@spryker-oryx/di';
import { ComponentMapping } from '@spryker-oryx/experience';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';

export const componentsProvider: Provider = {
  provide: ComponentMapping,
  useValue: {
    ['oryx-auth-login']: {
      template: (uid: string, layoutClasses?: string) =>
        html`<oryx-auth-login
          uid="${uid}"
          class=${ifDefined(layoutClasses)}
        ></oryx-auth-login>`,
    },
    ['auth-logout']: {
      template: (uid: string, layoutClasses?: string) =>
        html`<auth-logout
          uid="${uid}"
          class=${ifDefined(layoutClasses)}
        ></auth-logout>`,
    },
  },
};
