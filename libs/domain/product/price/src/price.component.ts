import { ContentMixin, defaultOptions } from '@spryker-oryx/experience';
import { ProductContext, ProductMixin } from '@spryker-oryx/product';
import { computed, hydratable, signalProperty } from '@spryker-oryx/utilities';
import { LitElement, TemplateResult, html } from 'lit';
import { property } from 'lit/decorators.js';
import { ProductPriceOptions } from './price.model';
import { ProductPriceStyles } from './price.styles';

/**
 * Renders the (formatted) product price.
 *
 * The component provides the ability to render two prices:
 * 1. The sales price (AKA "default" price)
 * 2. The original price (AKA "strikethrough" or "from" price)
 *
 * The sales price is always rendered, where as the original price can be configured
 * to not be rendered.
 *
 *
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

  /**
   * Indicates the sales price. If the sales price is not given by a property,
   * it will be resolved from the product data.
   */
  @signalProperty() sales?: number;

  /**
   * The component uses the `PriceComponent` to render prices in the active currency.
   * If a currency is provided, the price currency must match this currency, otherwise the price
   * is not rendered
   */
  @property() currency?: string;

  protected $salesPrice = computed(() => {
    const { defaultPrice } = this.$product()?.price ?? {};
    return (
      (!this.currency || this.currency === defaultPrice?.currency) &&
      defaultPrice?.value
    );
  });

  protected $originalPrice = computed(() => {
    const { originalPrice } = this.$product()?.price ?? {};
    return (
      (!this.currency || this.currency === originalPrice?.currency) &&
      originalPrice?.value
    );
  });

  protected $isDiscounted = computed(() => {
    return (
      (this.sales &&
        typeof this.$salesPrice() === 'number' &&
        this.sales < Number(this.$salesPrice())) ||
      (typeof this.$salesPrice() === 'number' &&
        typeof this.$salesPrice() === 'number' &&
        Number(this.$originalPrice()) < Number(this.$originalPrice()))
    );
  });

  protected override render(): TemplateResult | void {
    return html`
      ${this.renderSalesPrice()} ${this.renderTaxMessage()}
      ${this.renderOriginalPrice()} ${this.renderSalesLabel()}
    `;
  }

  protected renderSalesPrice(): TemplateResult | void {
    const price = this.sales ?? this.$salesPrice() ?? this.$originalPrice();
    if (!price) return;

    return html`<oryx-site-price
      .value=${price}
      .currency=${this.currency}
      part="sales"
      ?has-discount=${this.$isDiscounted()}
    ></oryx-site-price>`;
  }

  protected renderOriginalPrice(): TemplateResult | void {
    const price = this.$originalPrice() || this.$salesPrice();
    if (!price) return;

    return html`<oryx-site-price
      .value=${price}
      .currency=${this.currency}
      part="original"
    ></oryx-site-price>`;
  }

  protected renderTaxMessage(): TemplateResult | void {
    if (
      !this.$options().enableTaxMessage ||
      (!this.$salesPrice() && !this.$originalPrice())
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

  protected renderSalesLabel(): TemplateResult | void {
    if (!this.$options().enableSalesLabel) return;

    return html`
      <oryx-product-labels
        part="labels"
        .options=${{ included: 'sale %', invert: true }}
      ></oryx-product-labels>
    `;
  }
}
