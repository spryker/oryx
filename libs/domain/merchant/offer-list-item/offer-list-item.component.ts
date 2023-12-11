import { ContentMixin } from '@spryker-oryx/experience';
import { LitElement, TemplateResult, html } from 'lit';

import { ProductMixin } from '@spryker-oryx/product';
import { IconTypes } from '@spryker-oryx/ui/icon';
import {
  Size,
  computed,
  signalAware,
  signalProperty,
} from '@spryker-oryx/utilities';
import { merchantOfferListItemStyles } from './offer-list-item.styles';

@signalAware()
export class MerchantOfferListItemComponent extends ProductMixin(
  ContentMixin(LitElement)
) {
  static styles = merchantOfferListItemStyles;

  @signalProperty() protected offerId?: string;

  protected $offer = computed(() => {
    return this.$product()?.offers?.find((offer) => offer.id === this.offerId);
  });

  protected override render(): TemplateResult | void {
    const offer = this.$offer();
    if (!offer) return;

    return html`${offer.merchant.name}

      <oryx-product-price
        .options=${{ enableTaxMessage: false }}
      ></oryx-product-price>

      <span class="delivery-time">
        <oryx-icon .type=${IconTypes.Carrier} .size=${Size.Md}></oryx-icon>
        ${offer.merchant.deliveryTime}
      </span>

      <oryx-product-availability
        .options=${{ hideInStock: true }}
      ></oryx-product-availability>`;
  }
}
