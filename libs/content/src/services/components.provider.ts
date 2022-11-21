import { ComponentMapping } from '@spryker-oryx/experience';
import { Provider } from '@spryker-oryx/injector';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';

export const componentsProvider: Provider = {
  provide: ComponentMapping,
  useValue: {
    ['content-link']: {
      template: (uid: string, layoutClasses?: string) =>
        html`<content-link
          uid="${uid}"
          class=${ifDefined(layoutClasses)}
        ></content-link>`,
    },
    ['oryx-banner']: {
      template: (uid: string, layoutClasses?: string) =>
        html`<oryx-banner
          uid="${uid}"
          class=${ifDefined(layoutClasses)}
        ></oryx-banner>`,
    },
  },
};
