import { Provider } from '@spryker-oryx/di';
import { ComponentMapping } from '@spryker-oryx/experience';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';

export const componentsProvider: Provider = {
  provide: ComponentMapping,
  useValue: {
    ['search-box']: {
      template: (uid: string, layoutClasses?: string) =>
        html`<search-box
          uid="${uid}"
          class=${ifDefined(layoutClasses)}
        ></search-box>`,
    },
    ['search-facet-navigation']: {
      template: (uid: string, layoutClasses?: string) =>
        html`<search-facet-navigation
          uid="${uid}"
          class=${ifDefined(layoutClasses)}
        ></search-facet-navigation>`,
    },
  },
};
