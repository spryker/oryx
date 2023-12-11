import { ContentMixin } from '@spryker-oryx/experience';
import { HTMLTemplateResult, LitElement, TemplateResult, html } from 'lit';

import { ContextService } from '@spryker-oryx/core';
import { resolve } from '@spryker-oryx/di';
import {
  ProductContext,
  ProductMixin,
  ProductOffer,
} from '@spryker-oryx/product';
import { RouteType } from '@spryker-oryx/router';
import { LinkService } from '@spryker-oryx/site';
import { HeadingTag } from '@spryker-oryx/ui/heading';
import {
  computed,
  elementEffect,
  hydrate,
  signal,
} from '@spryker-oryx/utilities';
import { queryAll } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { merchantOffersStyles } from './offer-list.styles';

@hydrate({ context: ProductContext.SKU })
export class MerchantOfferListComponent extends ProductMixin(
  ContentMixin(LitElement)
) {
  static styles = merchantOffersStyles;

  protected contextService = resolve(ContextService);
  protected linkService = resolve(LinkService);

  @queryAll('input') protected inputElements?: HTMLInputElement[];

  /**
   * Resolves the current offer from the product context.
   */
  protected $current = computed(() => {
    const { offer: offerId } = this.$productQualifier() ?? {};
    let selected = this.$product()?.offers?.find(
      (offer) => offer.id === offerId
    );
    if (!selected)
      selected = this.$product()?.offers?.find((offer) => offer.isDefault);
    return selected;
  });

  @elementEffect()
  protected selectRadioElements = (): void => {
    const current = this.$current()?.id;
    setTimeout(() => {
      this.inputElements?.forEach((el) => {
        el.checked = el.value === current;
        el.dispatchEvent(new Event('change', { bubbles: true }));
      });
    }, 0);
  };

  protected override render(): TemplateResult | void {
    const offers = this.$product()?.offers;
    if (!offers?.length) return;

    return html`
      <oryx-collapsible>
        <oryx-heading
          slot="heading"
          .tag=${HeadingTag.H4}
          .typography=${HeadingTag.H5}
        >
          ${this.i18n('product.offer.available-<count>-merchants', {
            count: this.$product()?.offers?.length,
          })}
        </oryx-heading>
        <oryx-product-media slot="heading"></oryx-product-media>

        ${repeat(
          offers,
          (offer) => offer.id,
          (offer) => this.renderOffer(offer)
        )}
      </oryx-collapsible>
    `;
  }

  protected renderOffer(offer: ProductOffer): HTMLTemplateResult | void {
    const sku = this.$product()?.sku;

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

    const current = this.$current()?.id;

    return html`
      <a
        href=${$link()}
        tabindex="-1"
        aria-label=${this.i18n('merchant.link-to-<offer>', {
          offer: offer.id,
        })}
      >
        <oryx-radio data-sku=${productContext}>
          <input
            type="radio"
            name="offer"
            aria-label=${this.i18n('merchant.link-to-<offer>', {
              offer: offer.id,
            })}
            value=${offer.id}
            ?checked=${offer.id === current}
            tabindex="0"
          />
          <oryx-merchant-offer-list-item
            .offerId=${offer.id}
          ></oryx-merchant-offer-list-item>
        </oryx-radio>
      </a>
    `;
  }
}
