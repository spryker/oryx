import { html, TemplateResult } from 'lit';

export interface ComponentMapping {
  tag?: string;
  component?: () => void;
  template?: (uid: string, layoutClasses?: string) => TemplateResult;
}

export interface ComponentsMapping {
  [wildcard: string]: ComponentMapping;
}

export const componentsMapping: ComponentsMapping = {
  ['experience-composition']: {
    template: (uid: string, layoutClasses?: string) =>
      html`<experience-composition
        uid="${uid}"
        class=${layoutClasses}
      ></experience-composition>`,
  },
  ['oryx-banner']: {
    template: (uid: string, layoutClasses?: string) =>
      html`<oryx-banner uid="${uid}" class=${layoutClasses}></oryx-banner>`,
  },
  ['product-title']: {
    template: (uid: string, layoutClasses?: string) =>
      html`<product-title uid="${uid}" class=${layoutClasses}></product-title>`,
  },
  ['product-images']: {
    template: (uid: string, layoutClasses?: string) =>
      html`<product-images
        uid="${uid}"
        class=${layoutClasses}
      ></product-images>`,
  },
  ['product-price']: {
    template: (uid: string, layoutClasses?: string) =>
      html`<product-price uid="${uid}" class=${layoutClasses}></product-price>`,
  },
  ['product-description']: {
    template: (uid: string, layoutClasses?: string) =>
      html`<product-description
        uid="${uid}"
        class=${layoutClasses}
      ></product-description>`,
  },
  ['product-average-rating']: {
    template: (uid: string, layoutClasses?: string) =>
      html`<product-average-rating
        uid="${uid}"
        class=${layoutClasses}
      ></product-average-rating>`,
  },
  ['product-media']: {
    template: (uid: string, layoutClasses?: string) =>
      html`<product-media uid="${uid}" class=${layoutClasses}></product-media>`,
  },
  ['product-id']: {
    template: (uid: string, layoutClasses?: string) =>
      html`<product-id uid="${uid}" class=${layoutClasses}></product-id>`,
  },
  ['product-card']: {
    template: (uid: string, layoutClasses?: string) =>
      html`<product-card uid="${uid}" class=${layoutClasses}></product-card>`,
  },
  ['product-attributes']: {
    template: (uid: string, layoutClasses?: string) =>
      html`<product-attributes
        uid="${uid}"
        class=${layoutClasses}
      ></product-attributes>`,
  },
  ['product-list']: {
    template: (uid: string, layoutClasses?: string) =>
      html`<product-list uid="${uid}" class=${layoutClasses}></product-list>`,
  },
  ['user-login']: {
    template: (uid: string, layoutClasses?: string) =>
      html`<user-login uid="${uid}" class=${layoutClasses}></user-login>`,
  },
  ['add-to-cart']: {
    template: (uid: string, layoutClasses?: string) =>
      html`<add-to-cart uid="${uid}" class=${layoutClasses}></add-to-cart>`,
  },
  ['search-box']: {
    template: (uid: string, layoutClasses?: string) =>
      html`<search-box uid="${uid}" class=${layoutClasses}></search-box>`,
  },
  ['cart-entries']: {
    template: (uid: string, layoutClasses?: string) =>
      html`<cart-entries uid="${uid}" class=${layoutClasses}></cart-entries>`,
  },
  ['cart-totals']: {
    template: (uid: string) => html`<cart-totals uid="${uid}"></cart-totals>`,
  },
};
