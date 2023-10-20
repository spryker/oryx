import { ContentMixin } from '@spryker-oryx/experience';
import { HTMLTemplateResult, LitElement, TemplateResult, html } from 'lit';

import { resolve } from '@spryker-oryx/di';
import { RouteType } from '@spryker-oryx/router';
import { LinkService } from '@spryker-oryx/site';
import { signal } from '@spryker-oryx/utilities';
import { ProductMixin } from '../src/mixins';
import { productOffersStyles } from './offers.styles';

export class ProductOffersComponent extends ProductMixin(
  ContentMixin(LitElement)
) {
  static styles = productOffersStyles;

  protected override render(): TemplateResult | void {
    if (!this.$product()?.offers?.length) return;

    return html`
      <oryx-collapsible>
        <h4 slot="heading">
          ${this.i18n('product.offer.available-<count>-merchants', {
            count: this.$product()?.offers?.length,
          })}
        </h4>
        <oryx-product-media slot="heading"></oryx-product-media>
        <!-- ${this.renderOffer('main', undefined, 'url?')} -->
        <oryx-layout layout="list">
          ${this.$product()?.offers?.map((offer) => {
            return this.renderOffer(
              offer.merchant.name,
              offer.id,
              offer.merchant.url
            );
          })}
        </oryx-layout>
      </oryx-collapsible>
    `;
  }

  protected linkService = resolve(LinkService);

  protected renderOffer(
    name: string,
    offer: string,
    slug?: string
  ): HTMLTemplateResult | void {
    const sku2 = `${this.$product()?.sku}${offer ? `,${offer}` : ''}`;
    const sku = this.$product()?.sku;
    if (!sku) return;

    const $link = signal(
      this.linkService.get({
        type: RouteType.Product,
        qualifier: { sku, offer },
      })
    );
    return html`
      <div class="offer" data-sku=${sku2}>
        <oryx-button
          icon="arrow_forward"
          type="text"
          text=${name}
          .href=${$link()}
        ></oryx-button>
        <oryx-product-availability
          .options=${{ enableIndicator: true, enableExactStock: true }}
        ></oryx-product-availability>
        <oryx-product-price
          .options=${{ enableTaxMessage: false }}
        ></oryx-product-price>
      </div>
      <!-- <oryx-link>
          <a href="/merchants/${slug}">About this seller</a>
        </oryx-link> -->
    `;
  }
}
