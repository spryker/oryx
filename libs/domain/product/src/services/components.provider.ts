import { Provider } from '@spryker-oryx/di';
import { ComponentMapping } from '@spryker-oryx/experience';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';

export const componentsProvider: Provider = {
  provide: ComponentMapping,
  useValue: {
    ['oryx-product-title']: {
      template: (uid: string, layoutClasses?: string) =>
        html`<oryx-product-title
          uid="${uid}"
          class=${ifDefined(layoutClasses)}
        ></oryx-product-title>`,
    },
    ['product-images']: {
      template: (uid: string, layoutClasses?: string) =>
        html`<product-images
          uid="${uid}"
          class=${ifDefined(layoutClasses)}
        ></product-images>`,
    },
    ['oryx-product-price']: {
      template: (uid: string, layoutClasses?: string) =>
        html`<oryx-product-price
          uid="${uid}"
          class=${ifDefined(layoutClasses)}
        ></oryx-product-price>`,
    },
    ['oryx-product-description']: {
      template: (uid: string, layoutClasses?: string) =>
        html`<oryx-product-description
          uid="${uid}"
          class=${ifDefined(layoutClasses)}
        ></oryx-product-description>`,
    },
    ['oryx-product-average-rating']: {
      template: (uid: string, layoutClasses?: string) =>
        html`<oryx-product-average-rating
          uid="${uid}"
          class=${ifDefined(layoutClasses)}
        ></oryx-product-average-rating>`,
    },
    ['oryx-product-media']: {
      template: (uid: string, layoutClasses?: string) =>
        html`<oryx-product-media
          uid="${uid}"
          class=${ifDefined(layoutClasses)}
        ></oryx-product-media>`,
    },
    ['oryx-product-id']: {
      template: (uid: string, layoutClasses?: string) =>
        html`<oryx-product-id
          uid="${uid}"
          class=${ifDefined(layoutClasses)}
        ></oryx-product-id>`,
    },
    ['oryx-product-labels']: {
      template: (uid: string, layoutClasses?: string) =>
        html`<oryx-product-labels
          uid="${uid}"
          class=${ifDefined(layoutClasses)}
        ></oryx-product-labels>`,
    },
    ['oryx-product-card']: {
      template: (uid: string, layoutClasses?: string) =>
        html`<oryx-product-card
          uid="${uid}"
          class=${ifDefined(layoutClasses)}
        ></oryx-product-card>`,
    },
    ['oryx-product-attributes']: {
      template: (uid: string, layoutClasses?: string) =>
        html`<oryx-product-attributes
          uid="${uid}"
          class=${ifDefined(layoutClasses)}
        ></oryx-product-attributes>`,
    },
    ['oryx-product-list']: {
      template: (uid: string, layoutClasses?: string) =>
        html`<product-list
          uid="${uid}"
          class=${ifDefined(layoutClasses)}
        ></product-list>`,
    },
  },
};
