import { ContentMixin } from '@spryker-oryx/experience';
import { HTMLTemplateResult, LitElement, TemplateResult, html } from 'lit';

import { resolve } from '@spryker-oryx/di';
import { RouteType } from '@spryker-oryx/router';
import { LinkService } from '@spryker-oryx/site';
import { signal } from '@spryker-oryx/utilities';
import { ProductMixin } from '../src/mixins';
import { ProductOffer } from '../src/models';
import { productOffersStyles } from './offers.styles';

export class ProductOffersComponent extends ProductMixin(
  ContentMixin(LitElement)
) {
  static styles = productOffersStyles;

  protected override render(): TemplateResult | void {
    if (!this.$product()?.offers?.length) return;
    console.log(this.$product()?.offers);
    return html`
      <oryx-collapsible>
        <h4 slot="heading">
          ${this.i18n('product.offer.available-<count>-merchants', {
            count: this.$product()?.offers?.length,
          })}
        </h4>
        <oryx-product-media slot="heading"></oryx-product-media>
        <oryx-layout layout="list">
          ${this.$product()?.offers?.map((offer) => {
            return this.renderOffer(offer);
          })}
        </oryx-layout>
      </oryx-collapsible>
    `;
  }

  protected linkService = resolve(LinkService);

  protected renderOffer(offer: ProductOffer): HTMLTemplateResult | void {
    const sku2 = `${this.$product()?.sku}${offer ? `,${offer.id}` : ''}`;
    const sku = this.$product()?.sku;
    if (!sku) return;
    console.log(sku2);
    const $link = signal(
      this.linkService.get({
        type: RouteType.Product,
        qualifier: { sku, offer: offer.id },
      })
    );
    return html`
      <oryx-radio data-sku=${sku2}>
        <input type="radio" name="offer" />
        <oryx-button
          type="text"
          text=${offer.merchant.name}
          .href=${$link()}
        ></oryx-button>
        <oryx-product-price
          .options=${{ enableTaxMessage: false }}
        ></oryx-product-price>

        <span class="delivery">
          ${offer.merchant.deliveryTime}
          <oryx-product-availability></oryx-product-availability>
        </span>
      </oryx-radio>
    `;
  }
}

// <!-- <oryx-link>
// <a href="/merchants/${slug}">About this seller</a>
// </oryx-link> -->
