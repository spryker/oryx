import { StorefrontContent } from './storefront.model';
import '@spryker-oryx/content/banner';
import { html, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';

export class StorefrontComponent extends LitElement {
  @property({ type: Object })
  protected content?: StorefrontContent = {
    banner: {
      title: 'SSR banner',
      subtitle: 'This banner is rendered with lit SSR',
      content: 'banner contents',
      image:
        'https://res.cloudinary.com/drrusglvs/image/upload/v1641985933/b7bhmsvqduyczsbhiiwx.gif',
      urlTarget: '_blank',
    },
    banner2: {
      title: 'Another SSR banner',
      subtitle: 'This banner is rendered with lit SSR',
      content: 'banner contents',
      link: 'https://spryker.com',
      image:
        'https://res.cloudinary.com/drrusglvs/image/upload/v1641985933/b7bhmsvqduyczsbhiiwx.gif',
      urlTarget: '_blank',
      alt: 'banner alt',
    },
  };

  override render(): TemplateResult {
    return html`<div class="oryx-banner">Oryx Banner</div>
      <div class="container">
        <oryx-banner .content="${this.content?.banner}"></oryx-banner>
      </div>
      <div class="my-element">Another Oryx Banner</div>
      <div class="container">
        <oryx-banner .content="${this.content?.banner2}"></oryx-banner>
      </div> `;
  }
}

customElements.get('storefront-component') ||
  customElements.define('storefront-component', StorefrontComponent);
