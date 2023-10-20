import { ContentMixin } from '@spryker-oryx/experience';
import { HTMLTemplateResult, LitElement, TemplateResult, html } from 'lit';

import { resolve } from '@spryker-oryx/di';
import { RouteType } from '@spryker-oryx/router';
import { LinkService } from '@spryker-oryx/site';
import { computed, signal } from '@spryker-oryx/utilities';
import { queryAll } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { ProductMixin } from '../src/mixins';
import { ProductOffer } from '../src/models';
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
        <oryx-layout layout="list">
          <form @input=${this.updateList}>
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
    return this.$product()?.offers?.find((offer) => offer.id === offerId);
  });

  protected renderOffer(offer: ProductOffer): HTMLTemplateResult | void {
    const sku2 = `${this.$product()?.sku}${offer ? `,${offer.id}` : ''}`;
    const sku = this.$product()?.sku;
    // const { offer: offerId } = this.$productQualifier() ?? {};
    if (!sku) return;

    const $link = signal(
      this.linkService.get({
        type: RouteType.Product,
        qualifier: { sku, offer: offer.id },
      })
    );
    return html`
      <a .href=${$link()}>
        <oryx-radio data-sku=${sku2}>
          <input
            type="radio"
            name="offer"
            value=${offer.id}
            .checked=${offer.id === this.$active()?.id}
            @input=${this.updateList}
          />
          <oryx-button
            type="text"
            text=${offer.merchant.name}
            .href=${$link()}
          ></oryx-button>
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

  @queryAll('input') protected inputs?: HTMLInputElement[];

  protected updateList(value: boolean): void {
    const inputElements = this.inputs;
    console.log(inputElements?.length);

    inputElements?.forEach((inputElement: HTMLInputElement) => {
      console.log(inputElement.value);
      // inputElement.checked = value;
      // inputElement.dispatchEvent(
      //   new InputEvent('input', { bubbles: true, composed: true })
      // );
    });
  }
}

// <!-- <oryx-link>
// <a href="/merchants/${slug}">About this seller</a>
// </oryx-link> -->
