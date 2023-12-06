import { ContentMixin } from '@spryker-oryx/experience';
import { HTMLTemplateResult, LitElement, TemplateResult, html } from 'lit';

import { ContextService } from '@spryker-oryx/core';
import { resolve } from '@spryker-oryx/di';
import { ProductContext } from '@spryker-oryx/product';
import { RouteType } from '@spryker-oryx/router';
import { LinkService } from '@spryker-oryx/site';
import { computed, effect, signal } from '@spryker-oryx/utilities';
import { queryAll } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { ProductMixin } from '../src/mixins';
import { ProductOffer } from '../src/models';
import { productOffersStyles } from './offers.styles';

export class ProductOffersComponent extends ProductMixin(
  ContentMixin(LitElement)
) {
  static styles = productOffersStyles;

  protected contextService = resolve(ContextService);

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
        <oryx-layout layout="list">
          <form>
            ${repeat(
              this.$product()?.offers ?? [],
              (offer) => offer.id,
              (offer) => this.renderOffer(offer)
            )}
          </form>
        </oryx-layout>
      </oryx-collapsible>
    `;
  }

  protected linkService = resolve(LinkService);

  protected $active = computed(() => {
    const { offer: offerId } = this.$productQualifier() ?? {};
    let selected = this.$product()?.offers?.find(
      (offer) => offer.id === offerId
    );
    if (!selected)
      selected = this.$product()?.offers?.find((offer) => offer.isDefault);
    return selected;
  });

  @queryAll('input') protected inputElements?: HTMLInputElement[];

  protected selectRadioElements = effect(() => {
    const addressId = this.$active()?.id;
    setTimeout(() => {
      this.inputElements?.forEach((el) => {
        el.checked = el.value === addressId;
        el.dispatchEvent(new Event('change', { bubbles: true }));
      });
    }, 0);
  });

  protected renderOffer(offer: ProductOffer): HTMLTemplateResult | void {
    const sku = this.$product()?.sku;

    if (!sku) return;

    const qualifier = { sku, offer: offer.id };

    const $link = signal(
      this.linkService.get({
        type: RouteType.Product,
        qualifier,
      })
    );

    const productContext = signal(
      this.contextService.serialize(ProductContext.SKU, qualifier)
    );

    return html`
      <a href=${$link()} tabindex="-1">
        <oryx-radio data-sku=${productContext}>
          <input
            type="radio"
            name="offer"
            value=${offer.id}
            ?checked=${this.$active()?.id === offer.id}
          />
          <h5>${offer.merchant.name}</h5>
          <!-- <oryx-button
            type="text"
            text=${offer.merchant.name}
            .href=${$link()}
          ></oryx-button> -->
          <oryx-product-price
            .options=${{ enableTaxMessage: false }}
          ></oryx-product-price>

          <span class="delivery">
            <span class="delivery-time">
              <oryx-icon type="schedule" size="sm"></oryx-icon>
              ${offer.merchant.deliveryTime}
            </span>
            <oryx-product-availability></oryx-product-availability>
          </span>
        </oryx-radio>
      </a>
    `;
  }
}
