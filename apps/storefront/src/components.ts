import { html, TemplateResult } from 'lit';
export interface ComponentMapping {
  tag?: string;
  component?: () => void;
  template?: (uid: string) => TemplateResult;
}

export interface ComponentsMapping {
  [wildcard: string]: ComponentMapping;
}

export const componentsMapping: ComponentsMapping = {
  ['experience-composition']: {
    template: (uid: string) =>
      html`<experience-composition uid="${uid}"></experience-composition>`,
  },
  ['oryx-banner']: {
    template: (uid: string) => html`<oryx-banner uid="${uid}"></oryx-banner>`,
  },

  ['product-title']: {
    template: (uid: string) =>
      html`<product-title uid="${uid}"></product-title>`,
  },
  ['product-images']: {
    template: (uid: string) =>
      html`<product-images uid="${uid}"></product-images>`,
  },
  ['product-price']: {
    template: (uid: string) =>
      html`<product-price uid="${uid}"></product-price>`,
  },
  ['product-description']: {
    template: (uid: string) =>
      html`<product-description uid="${uid}"></product-description>`,
  },
  ['product-average-rating']: {
    template: (uid: string) =>
      html`<product-average-rating uid="${uid}"></product-average-rating>`,
  },
  ['product-media']: {
    template: (uid: string) =>
      html`<product-media uid="${uid}"></product-media>`,
  },
  ['product-id']: {
    template: (uid: string) => html`<product-id uid="${uid}"></product-id>`,
  },
  ['product-card']: {
    template: (uid: string) => html`<product-card uid="${uid}"></product-card>`,
  },
  ['product-attributes']: {
    template: (uid: string) =>
      html`<product-attributes uid="${uid}"></product-attributes>`,
  },
  ['user-login']: {
    template: (uid: string) => html`<user-login uid="${uid}"></user-login>`,
  },
  ['add-to-cart']: {
    template: (uid: string) => html`<add-to-cart uid="${uid}"></add-to-cart>`,
  },
  ['search-box']: {
    template: (uid: string) => html`<search-box uid="${uid}"></search-box>`,
  },
};
