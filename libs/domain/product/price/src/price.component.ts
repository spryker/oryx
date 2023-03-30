import { resolve } from '@spryker-oryx/di';
import { ContentMixin, defaultOptions } from '@spryker-oryx/experience';
import { ProductMixin } from '@spryker-oryx/product';
import { PricingService } from '@spryker-oryx/site';
import {
  computed,
  hydratable,
  i18n,
  signal,
  SignalController,
} from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
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
@defaultOptions({
  enableOriginalPrice: true,
  enableTaxMessage: true,
})
@hydratable(['mouseover', 'focusin'])
export class ProductPriceComponent extends ProductMixin(
  ContentMixin<ProductPriceOptions>(LitElement)
) {
  static styles = ProductPriceStyles;

  protected pricingService = resolve(PricingService);

  protected singalController = new SignalController(this);

  salesPrice = computed(() =>
    signal(this.pricingService.format(this.productS()?.price?.defaultPrice))()
  );

  originalPrice = computed(() =>
    signal(this.pricingService.format(this.productS()?.price?.originalPrice))()
  );

  protected override render(): TemplateResult | void {
    return html`
      ${this.renderSalesPrice()} ${this.renderTaxMessage()}
      ${this.renderOriginalPrice()} ${this.renderSalesLabel()}
    `;
  }

  protected renderSalesPrice(): TemplateResult | void {
    const originalPrice = this.originalPrice();
    const salesPrice = this.salesPrice();

    if (!salesPrice && !originalPrice) return;

    const hasDiscount = !!salesPrice && !!originalPrice;

    return html`<span part="sales" ?has-discount=${hasDiscount}
      >${salesPrice ?? originalPrice}</span
    >`;
  }

  protected renderTaxMessage(): TemplateResult | void {
    if (
      !this.componentOptionsS().enableTaxMessage ||
      (!this.salesPrice() && !this.originalPrice())
    )
      return;

    return html`<span part="tax">
      ${i18n(
        `product.price.${
          this.productS()?.price?.originalPrice?.isNet
            ? 'tax-excluded'
            : 'tax-included'
        }`
      )}
    </span>`;
  }

  protected renderOriginalPrice(): TemplateResult | void {
    if (
      !this.componentOptionsS().enableOriginalPrice ||
      !this.salesPrice() ||
      !this.originalPrice()
    ) {
      return;
    }
    return html`<span part="original">${this.originalPrice()}</span>`;
  }

  protected renderSalesLabel(): TemplateResult | void {
    if (!this.componentOptionsS().enableSalesLabel) return;

    return html`
      <oryx-product-labels
        part="labels"
        .options=${{ included: 'sale %', invert: true }}
      ></oryx-product-labels>
    `;
  }
}
