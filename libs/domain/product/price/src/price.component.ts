import { resolve } from '@spryker-oryx/di';
import { ContentMixin, defaultOptions } from '@spryker-oryx/experience';
import {
  ProductContext,
  ProductMixin,
  ProductPrices,
} from '@spryker-oryx/product';
import { PricingService } from '@spryker-oryx/site';
import { computed, hydratable } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { combineLatest, Observable } from 'rxjs';
import { Prices, ProductPriceOptions } from './price.model';
import { ProductPriceStyles } from './price.styles';

/**
 * Renders the (formatted) product price.
 *
 * The component provides the ability to render two prices:
 * 1. the sales price (AKA "default" price)
 * 2. the original price (AKA "strikethrough" or "from" price)
 *
 * The sales price is always rendered, where as the original price
 * can be configured to not be rendered.
 *
 * The components leverages the `PricingService` to format the prices for
 * the active locale and currency.
 */
@defaultOptions({
  enableOriginalPrice: true,
  enableTaxMessage: true,
})
@hydratable(`@${ProductContext.SKU}`)
export class ProductPriceComponent extends ProductMixin(
  ContentMixin<ProductPriceOptions>(LitElement)
) {
  static styles = ProductPriceStyles;

  protected pricingService = resolve(PricingService);

  protected $prices = computed(() => {
    return this.formatPrices(this.$product()?.price);
  });

  protected override render(): TemplateResult | void {
    return html`
      ${this.renderSalesPrice()} ${this.renderTaxMessage()}
      ${this.renderOriginalPrice()} ${this.renderSalesLabel()}
    `;
  }

  protected renderSalesPrice(): TemplateResult | void {
    const { original, sales } = this.$prices() ?? {};

    if (!sales && !original) return;

    const hasDiscount = !!sales && !!original;

    return html`<span part="sales" ?has-discount=${hasDiscount}
      >${sales ?? original}</span
    >`;
  }

  protected renderTaxMessage(): TemplateResult | void {
    if (
      !this.$options().enableTaxMessage ||
      (!this.$prices()?.sales && !this.$prices()?.original)
    )
      return;

    return html`<span part="tax">
      ${this.i18n(
        `product.price.${
          this.$product()?.price?.originalPrice?.isNet
            ? 'tax-excluded'
            : 'tax-included'
        }`
      )}
    </span>`;
  }

  protected renderOriginalPrice(): TemplateResult | void {
    const { original, sales } = this.$prices() ?? {};
    if (!this.$options().enableOriginalPrice || !sales || !original) {
      return;
    }
    return html`<span part="original">${original}</span>`;
  }

  protected renderSalesLabel(): TemplateResult | void {
    if (!this.$options().enableSalesLabel) return;

    return html`
      <oryx-product-labels
        part="labels"
        .options=${{ included: 'sale %', invert: true }}
      ></oryx-product-labels>
    `;
  }

  /**
   * Formats the given product prices and emits an object containing the formatted
   * sales price and original price.
   */
  protected formatPrices(price?: ProductPrices): Observable<Prices> {
    return combineLatest({
      sales: this.pricingService.format(price?.defaultPrice),
      original: this.pricingService.format(price?.originalPrice),
    });
  }
}
