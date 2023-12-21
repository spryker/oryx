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
import { merchantOfferListItemStyles } from './offer-list-item.styles';

@hydrate({ context: ProductContext.SKU })
@signalAware()
export class MerchantOfferListItemComponent extends ProductMixin(
  ContentMixin(LitElement)
) {
  static styles = merchantOfferListItemStyles;

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

  // protected linkService = resolve(LinkService);

  // protected $link = computed(() => {
  //   const offer = this.$product()?.offers?.find(
  //     (offer) => offer.id === this.offerId //&& !offer.isDefault
  //   );

  //   const qualifier = {
  //     sku: this.$product()?.sku,
  //     offer: offer?.id,
  //   };

  //   return this.linkService.get({
  //     type: RouteType.Product,
  //     qualifier,
  //   });
  // });

  protected override render(): TemplateResult | void {
    const offer = this.$offer();
    if (!offer) return;

    return html`
      ${offer.merchant.name}

      <oryx-product-price
        .options=${{ enableTaxMessage: false }}
      ></oryx-product-price>

      <span class="delivery-time">
        <oryx-icon .type=${IconTypes.Carrier} .size=${Size.Md}></oryx-icon>
        ${offer.merchant.deliveryTime}
      </span>

      <oryx-product-availability
        .options=${{ hideInStock: true }}
      ></oryx-product-availability>
    `;
  }

  private onMouseDown(): void {
    console.log('mousedown link');
  }

  private onFocusin(): void {
    console.log('focus in link');
  }
}
