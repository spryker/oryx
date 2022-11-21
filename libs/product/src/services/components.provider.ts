import { ComponentMapping } from '@spryker-oryx/experience';
import { Provider } from '@spryker-oryx/injector';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';

export const componentsProvider: Provider = {
  provide: ComponentMapping,
  useValue: {
    ['product-title']: {
      template: (uid: string, layoutClasses?: string) =>
        html`<product-title
          uid="${uid}"
          class=${ifDefined(layoutClasses)}
        ></product-title>`,
    },
    ['product-images']: {
      template: (uid: string, layoutClasses?: string) =>
        html`<product-images
          uid="${uid}"
          class=${ifDefined(layoutClasses)}
        ></product-images>`,
    },
    ['product-price']: {
      template: (uid: string, layoutClasses?: string) =>
        html`<product-price
          uid="${uid}"
          class=${ifDefined(layoutClasses)}
        ></product-price>`,
    },
    ['product-description']: {
      template: (uid: string, layoutClasses?: string) =>
        html`<product-description
          uid="${uid}"
          class=${ifDefined(layoutClasses)}
        ></product-description>`,
    },
    ['product-average-rating']: {
      template: (uid: string, layoutClasses?: string) =>
        html`<product-average-rating
          uid="${uid}"
          class=${ifDefined(layoutClasses)}
        ></product-average-rating>`,
    },
    ['product-media']: {
      template: (uid: string, layoutClasses?: string) =>
        html`<product-media
          uid="${uid}"
          class=${ifDefined(layoutClasses)}
        ></product-media>`,
    },
    ['product-id']: {
      template: (uid: string, layoutClasses?: string) =>
        html`<product-id
          uid="${uid}"
          class=${ifDefined(layoutClasses)}
        ></product-id>`,
    },
    ['product-labels']: {
      template: (uid: string, layoutClasses?: string) =>
        html`<product-labels
          uid="${uid}"
          class=${ifDefined(layoutClasses)}
        ></product-labels>`,
    },
    ['product-card']: {
      template: (uid: string, layoutClasses?: string) =>
        html`<product-card
          uid="${uid}"
          class=${ifDefined(layoutClasses)}
        ></product-card>`,
    },
    ['product-attributes']: {
      template: (uid: string, layoutClasses?: string) =>
        html`<product-attributes
          uid="${uid}"
          class=${ifDefined(layoutClasses)}
        ></product-attributes>`,
    },
    ['product-list']: {
      template: (uid: string, layoutClasses?: string) =>
        html`<product-list
          uid="${uid}"
          class=${ifDefined(layoutClasses)}
        ></product-list>`,
    },
  },
};
