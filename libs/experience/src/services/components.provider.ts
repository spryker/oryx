import { Provider } from '@spryker-oryx/injector';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { ComponentMapping } from './experience-tokens';

export const componentsProvider: Provider = {
  provide: ComponentMapping,
  useValue: {
    ['experience-composition']: {
      template: (uid: string, layoutClasses?: string) =>
        html`<experience-composition
          uid="${uid}"
          class=${ifDefined(layoutClasses)}
        ></experience-composition>`,
    },
  },
};
