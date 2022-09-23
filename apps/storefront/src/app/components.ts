import { ComponentLayout } from '@spryker-oryx/experience';
import { html, TemplateResult } from 'lit';

export interface ComponentMapping {
  tag?: string;
  component?: () => void;
  template?: (uid: string, layout?: ComponentLayout) => TemplateResult;
}

export interface ComponentsMapping {
  [wildcard: string]: ComponentMapping;
}

export const componentsMapping: ComponentsMapping = {
  ['experience-composition']: {
    template: (uid: string, layout?: ComponentLayout) =>
      html`<experience-composition
        uid="${uid}"
        .style=${layout.styles}
        class=${layout.classes}
      ></experience-composition>`,
  },
  ['oryx-banner']: {
    template: (uid: string, layout?: ComponentLayout) =>
      html`<oryx-banner
        uid="${uid}"
        .style=${layout.styles}
        class=${layout.classes}
      ></oryx-banner>`,
  },
  ['product-title']: {
    template: (uid: string, layout?: ComponentLayout) =>
      html`<product-title
        uid="${uid}"
        .style=${layout.styles}
        class=${layout.classes}
      ></product-title>`,
  },
  ['product-images']: {
    template: (uid: string, layout?: ComponentLayout) =>
      html`<product-images
        uid="${uid}"
        .style=${layout.styles}
        class=${layout.classes}
      ></product-images>`,
  },
  ['product-price']: {
    template: (uid: string, layout?: ComponentLayout) =>
      html`<product-price
        uid="${uid}"
        .style=${layout.styles}
        class=${layout.classes}
      ></product-price>`,
  },
  ['product-description']: {
    template: (uid: string, layout?: ComponentLayout) =>
      html`<product-description
        uid="${uid}"
        .style=${layout.styles}
        class=${layout.classes}
      ></product-description>`,
  },
  ['product-average-rating']: {
    template: (uid: string, layout?: ComponentLayout) =>
      html`<product-average-rating
        uid="${uid}"
        .style=${layout.styles}
        class=${layout.classes}
      ></product-average-rating>`,
  },
  ['product-media']: {
    template: (uid: string, layout?: ComponentLayout) =>
      html`<product-media
        uid="${uid}"
        .style=${layout.styles}
        class=${layout.classes}
      ></product-media>`,
  },
  ['product-id']: {
    template: (uid: string, layout?: ComponentLayout) =>
      html`<product-id
        uid="${uid}"
        .style=${layout.styles}
        class=${layout.classes}
      ></product-id>`,
  },
  ['product-card']: {
    template: (uid: string, layout?: ComponentLayout) =>
      html`<product-card
        uid="${uid}"
        .style=${layout.styles}
        class=${layout.classes}
      ></product-card>`,
  },
  ['product-attributes']: {
    template: (uid: string, layout?: ComponentLayout) =>
      html`<product-attributes
        uid="${uid}"
        .style=${layout.styles}
        class=${layout.classes}
      ></product-attributes>`,
  },
  ['product-list']: {
    template: (uid: string, layout?: ComponentLayout) =>
      html`<product-list
        uid="${uid}"
        .style=${layout.styles}
        class=${layout.classes}
      ></product-list>`,
  },
  ['user-login']: {
    template: (uid: string, layout?: ComponentLayout) =>
      html`<user-login
        uid="${uid}"
        .style=${layout.styles}
        class=${layout.classes}
      ></user-login>`,
  },
  ['add-to-cart']: {
    template: (uid: string, layout?: ComponentLayout) =>
      html`<add-to-cart
        uid="${uid}"
        .style=${layout.styles}
        class=${layout.classes}
      ></add-to-cart>`,
  },
  ['search-box']: {
    template: (uid: string, layout?: ComponentLayout) =>
      html`<search-box
        uid="${uid}"
        .style=${layout.styles}
        class=${layout.classes}
      ></search-box>`,
  },
  ['cart-entries']: {
    template: (uid: string) => html`<cart-entries uid="${uid}"></cart-entries>`,
  },
  ['cart-totals']: {
    template: (uid: string) => html`<cart-totals uid="${uid}"></cart-totals>`,
  },
};
