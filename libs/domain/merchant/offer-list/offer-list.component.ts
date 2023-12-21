import { ContentMixin } from '@spryker-oryx/experience';
import { HTMLTemplateResult, LitElement, TemplateResult, html } from 'lit';

import { resolve } from '@spryker-oryx/di';
import {
  ProductContext,
  ProductMixin,
  ProductService,
} from '@spryker-oryx/product';
import { LinkService, RouteType } from '@spryker-oryx/router';
import { HeadingTag } from '@spryker-oryx/ui/heading';
import { computed, elementEffect, hydrate } from '@spryker-oryx/utilities';
import { queryAll } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { from, map, mergeMap, tap, toArray } from 'rxjs';
import { ProductOffer } from '../src/models';
import { merchantOffersStyles } from './offer-list.styles';

@hydrate({ context: ProductContext.SKU })
export class MerchantOfferListComponent extends ProductMixin(
  ContentMixin(LitElement)
) {
  static styles = merchantOffersStyles;

  protected linkService = resolve(LinkService);
  protected productService = resolve(ProductService, null);

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

  protected $offers = computed(() => {
    const product = this.$product();
    if (!product) return;

    return from(product.offers ?? []).pipe(
      mergeMap((offer) => {
        const qualifier = {
          sku: product.sku,
          offer: offer.id,
        };
        return this.linkService
          .get({ type: RouteType.Product, qualifier })
          .pipe(
            map((link) => ({ ...offer, link })) // Add the link to the offer object
          );
      }),
      tap(console.log),
      toArray()
    );
  });

  protected override render(): TemplateResult | void {
    console.log(this.$offers());
    const offers = this.$product()?.offers ?? [];
    if (offers.length < 2) return;

    return html` <oryx-collapsible>
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
      )}</oryx-collapsible
    >`;
  }

  protected renderOffer(offer: ProductOffer): HTMLTemplateResult | void {
    //href=${this.$link()}
    return html`
      <a
        tabindex="-1"
        aria-label=${this.i18n('merchant.link-to-<offer>', {
          offer: offer.id,
        })}
      >
        <oryx-radio>
          <input
            type="radio"
            name="offer"
            aria-label=${this.i18n('merchant.link-to-<offer>', {
              offer: offer.id,
            })}
            value=${offer.id}
            ?checked=${offer.id === this.$current()?.id}
          />
          <oryx-merchant-offer .offerId=${offer.id}></oryx-merchant-offer>
        </oryx-radio>
      </a>
    `;
  }
}
