import { ContentMixin } from '@spryker-oryx/experience';
import { LitElement, TemplateResult, html } from 'lit';

import { ContextController } from '@spryker-oryx/core';
import { ProductContext, ProductMixin } from '@spryker-oryx/product';
import { IconTypes } from '@spryker-oryx/ui/icon';
import {
  Size,
  computed,
  elementEffect,
  hydrate,
  signalAware,
  signalProperty,
} from '@spryker-oryx/utilities';
import { when } from 'lit/directives/when.js';
import { merchantOfferStyles } from './offer.styles';

@hydrate({ context: ProductContext.SKU })
@signalAware()
export class MerchantOfferComponent extends ProductMixin(
  ContentMixin(LitElement)
) {
  static styles = merchantOfferStyles;

  @signalProperty() protected offerId?: string;

  protected contextController = new ContextController(this);

  @elementEffect()
  protected setProductContext = (): void => {
    const sku = this.$product()?.sku;
    this.contextController.provide(ProductContext.SKU, {
      sku,
      offer: this.offerId,
    });
  };

  protected $offer = computed(() => {
    return this.$product()?.offers?.find((offer) => offer.id === this.offerId);
  });

  protected override render(): TemplateResult | void {
    const offer = this.$offer();
    if (!offer) return;

    return html`
      ${offer.merchant.name}

      <oryx-product-price
        .options=${{ enableTaxMessage: false }}
      ></oryx-product-price>

      ${when(
        offer.merchant.deliveryTime,
        () => html`
          <span class="delivery-time">
            <oryx-icon .type=${IconTypes.Carrier} .size=${Size.Md}></oryx-icon>
            ${offer.merchant.deliveryTime}
          </span>
        `
      )}

      <oryx-product-availability
        .options=${{ hideInStock: true }}
      ></oryx-product-availability>
    `;
  }
}
