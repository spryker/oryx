import { ContentMixin } from '@spryker-oryx/experience';
import { HTMLTemplateResult, LitElement, TemplateResult, html } from 'lit';

import { ProductMixin } from '../src/mixins';
import { productOffersStyles } from './offers.styles';

export class ProductOffersComponent extends ProductMixin(
  ContentMixin(LitElement)
) {
  static styles = productOffersStyles;

  protected override render(): TemplateResult | void {
    if (!this.$product()?.offers?.length) return;

    return html`
      <h3>${this.i18n('product.offers')}</h3>
      ${this.renderOffer(
        'main',
        this.$product()?.price?.defaultPrice?.value,
        'url?'
      )}
      ${this.$product()?.offers?.map((offer) =>
        this.renderOffer(offer.merchant.name, offer.price, offer.merchant.url)
      )}
    `;
  }

  protected renderOffer(
    name: string,
    price?: number,
    slug?: string
  ): HTMLTemplateResult {
    return html`
      <oryx-radio>
        <input name="offer" type="radio" />
        <oryx-link>
          <a href="/merchants/${slug}">${name}</a>
        </oryx-link>
        <oryx-site-price .value=${price}></oryx-site-price>
      </oryx-radio>
    `;
  }
}
