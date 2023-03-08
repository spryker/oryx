import { resolve } from '@spryker-oryx/di';
import { ContentMixin, defaultOptions } from '@spryker-oryx/experience';
import { ProductMixin, ProductPrices } from '@spryker-oryx/product';
import { PricingService } from '@spryker-oryx/site';
import {
  asyncState,
  hydratable,
  i18n,
  valueType,
} from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { combineLatest, Observable, switchMap } from 'rxjs';
import { ProductPriceOptions } from './price.model';
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
@defaultOptions({ enableOriginalPrice: true, enableVatMessage: true })
@hydratable(['mouseover', 'focusin'])
export class ProductPriceComponent extends ProductMixin(
  ContentMixin<ProductPriceOptions>(LitElement)
) {
  static styles = ProductPriceStyles;

  protected pricingService = resolve(PricingService);

  @asyncState()
  protected prices = valueType(
    this.productController
      .getProduct()
      .pipe(switchMap((product) => this.formatPrices(product?.price)))
  );

  protected override render(): TemplateResult | void {
    if (!this.product?.price) return;

    const salesPrice = this.prices
      ? html`<span part="sales">${this.prices.salesPrice}</span>`
      : undefined;

    const originalPrice =
      this.prices?.originalPrice && this.componentOptions?.enableOriginalPrice
        ? html`<span part="original">${this.prices.originalPrice}</span>`
        : undefined;

    const vatMessage = this.componentOptions?.enableVatMessage
      ? html`<span part="vat">
          ${i18n(
            `product.price.${
              this.product?.price?.originalPrice?.isNet
                ? 'excl-vat'
                : 'incl-vat'
            }`
          )}
        </span>`
      : undefined;

    return html`${salesPrice}${originalPrice}${vatMessage}`;
  }

  /**
   * Formats the given product prices and emits an object containing the formatted
   * sales price and original price.
   */
  protected formatPrices(
    price?: ProductPrices
  ): Observable<{ originalPrice: string | null; salesPrice: string | null }> {
    const salesPrice = this.pricingService.format(price?.defaultPrice);
    const originalPrice = this.pricingService.format(price?.originalPrice);
    return combineLatest({ salesPrice, originalPrice });
  }
}
