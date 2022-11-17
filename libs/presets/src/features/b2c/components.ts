import { html, TemplateResult } from 'lit';
import { ifDefined } from 'lit-html/directives/if-defined.js';

export interface ComponentMapping {
  tag?: string;
  component?: () => void;
  template?: (uid: string, layoutClasses?: string) => TemplateResult;
}

export interface ComponentsMapping {
  [wildcard: string]: ComponentMapping;
}

// TODO: change components mapping into array and fix experience implementation
export const componentsMapping: ComponentsMapping = {
  ['experience-composition']: {
    template: (uid: string, layoutClasses?: string) =>
      html`<experience-composition
        uid="${uid}"
        class=${ifDefined(layoutClasses)}
      ></experience-composition>`,
  },
  ['oryx-banner']: {
    template: (uid: string, layoutClasses?: string) =>
      html`<oryx-banner
        uid="${uid}"
        class=${ifDefined(layoutClasses)}
      ></oryx-banner>`,
  },
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
  ['search-facet-navigation']: {
    template: (uid: string, layoutClasses?: string) =>
      html`<search-facet-navigation
        uid="${uid}"
        class=${ifDefined(layoutClasses)}
      ></search-facet-navigation>`,
  },
  ['auth-login']: {
    template: (uid: string, layoutClasses?: string) =>
      html`<auth-login
        uid="${uid}"
        class=${ifDefined(layoutClasses)}
      ></auth-login>`,
  },
  ['add-to-cart']: {
    template: (uid: string, layoutClasses?: string) =>
      html`<add-to-cart
        uid="${uid}"
        class=${ifDefined(layoutClasses)}
      ></add-to-cart>`,
  },
  ['search-box']: {
    template: (uid: string, layoutClasses?: string) =>
      html`<search-box
        uid="${uid}"
        class=${ifDefined(layoutClasses)}
      ></search-box>`,
  },
  ['cart-entries']: {
    template: (uid: string, layoutClasses?: string) =>
      html`<cart-entries
        uid="${uid}"
        class=${ifDefined(layoutClasses)}
      ></cart-entries>`,
  },
  ['cart-totals']: {
    template: (uid: string, layoutClasses?: string) =>
      html`<cart-totals
        uid="${uid}"
        class=${ifDefined(layoutClasses)}
      ></cart-totals>`,
  },
  ['site-notification-center']: {
    template: (uid: string, layoutClasses?: string) =>
      html`<site-notification-center
        uid="${uid}"
        class=${ifDefined(layoutClasses)}
      ></site-notification-center>`,
  },
  ['checkout-link']: {
    template: (uid: string, layoutClasses?: string) =>
      html`<checkout-link
        uid="${uid}"
        class=${ifDefined(layoutClasses)}
      ></checkout-link>`,
  },
  ['checkout-guest']: {
    template: (uid: string, layoutClasses?: string) =>
      html`<checkout-guest
        uid="${uid}"
        class=${ifDefined(layoutClasses)}
      ></checkout-guest>`,
  },
  ['checkout-login']: {
    template: (uid: string, layoutClasses?: string) =>
      html`<checkout-login
        uid="${uid}"
        class=${ifDefined(layoutClasses)}
      ></checkout-login>`,
  },
};
