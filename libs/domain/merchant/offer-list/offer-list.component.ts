import { ContentMixin } from '@spryker-oryx/experience';
import { HTMLTemplateResult, LitElement, TemplateResult, html } from 'lit';

import { resolve } from '@spryker-oryx/di';
import {
  ProductContext,
  ProductMixin,
  ProductService,
} from '@spryker-oryx/product';
import { LinkService, RouteType } from '@spryker-oryx/router';
import { computed, elementEffect, hydrate } from '@spryker-oryx/utilities';
import { queryAll } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { Observable, combineLatest, map } from 'rxjs';
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
    if (!product?.offers?.length)
      return undefined as unknown as Observable<undefined>;

    return combineLatest(
      product.offers.map((offer) =>
        this.linkService
          .get({
            type: RouteType.Product,
            qualifier: { sku: product.sku, offer: offer.id },
          })
          .pipe(map((link) => ({ ...offer, link })))
      )
    );
  });

  protected override render(): TemplateResult | void {
    const offers = this.$offers();

    if (!offers || offers.length < 2) return;

    return html`
      ${repeat(
        offers,
        (offer) => offer.id,
        (offer) => this.renderOffer(offer)
      )}
    `;
  }

  protected renderOffer(
    offer: ProductOffer & { link: string | undefined }
  ): HTMLTemplateResult | void {
    return html`
      <a
        href=${offer.link}
        aria-label=${this.i18n('merchant.link-to-<offer>', {
          offer: offer.id,
        })}
        tabindex="-1"
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
            @click=${this.onClick}
          />
          <oryx-merchant-offer .offerId=${offer.id}></oryx-merchant-offer>
        </oryx-radio>
      </a>
    `;
  }

  protected onClick(ev: MouseEvent): void {
    if (ev.metaKey) {
      ev.preventDefault();
      (ev.target as HTMLInputElement)
        ?.closest('a')
        ?.dispatchEvent(new MouseEvent('click', { metaKey: true }));
    }
  }
}
