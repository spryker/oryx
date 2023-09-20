import { ContentMixin, defaultOptions } from '@spryker-oryx/experience';
import { ProductContext, ProductMixin } from '@spryker-oryx/product';
import { hydrate } from '@spryker-oryx/utilities';
import { LitElement, TemplateResult, html } from 'lit';
import { ProductPriceOptions } from './price.model';
import { ProductPriceStyles } from './price.styles';

/**
 * Renders the (formatted) product price.
 *
 * The component provides the ability to render two prices:
 * 1. The sales price (AKA "default" price)
 * 2. The original price (AKA "strikethrough" or "from" price)
 *
 * The sales price is always rendered, where as the original price can be
 * configured to not be rendered.
 *
 * The <oryx-site-price> component is used to render the price. This component
 * is responsible for formatting the price and currency.
 */
@defaultOptions({
  enableOriginalPrice: true,
  enableTaxMessage: true,
})
@hydrate({ context: ProductContext.SKU })
export class ProductPriceComponent extends ProductMixin(
  ContentMixin<ProductPriceOptions>(LitElement)
) {
  static styles = ProductPriceStyles;

  protected override render(): TemplateResult | void {
    return html`
      ${[
        this.renderSalesPrice(),
        this.renderTaxMessage(),
        this.renderOriginalPrice(),
        this.renderSalesLabel(),
      ]}
    `;
  }

  /**
   * Renders the sales price. The sales price defaults to the `defaultPrice`,
   * but in case the default price is not set, the `originalPrice` is used
   * instead.
   */
  protected renderSalesPrice(): TemplateResult | void {
    const { defaultPrice, originalPrice } = this.$product()?.price ?? {};
    const price = defaultPrice?.value ? defaultPrice : originalPrice;

    if (!price) return;

    return html`<oryx-site-price
      .value=${price.value}
      .currency=${price.currency}
      part="sales"
      ?discounted=${defaultPrice?.value !== originalPrice?.value}
    ></oryx-site-price>`;
  }

  /**
   * When the `enableOriginalPrice` option is `true` and the original price
   * is different from the sales price, the original price is rendered.
   */
  protected renderOriginalPrice(): TemplateResult | void {
    const { defaultPrice, originalPrice } = this.$product()?.price ?? {};

    if (
      !this.$options().enableOriginalPrice ||
      defaultPrice?.value === originalPrice?.value
    )
      return;

    return html`<oryx-site-price
      .value=${originalPrice?.value}
      .currency=${originalPrice?.currency}
      original
      part="original"
    ></oryx-site-price>`;
  }

  /**
   * Renders the tax message. The tax message is only rendered when the
   * `enableTaxMessage` option is `true` and when either the `defaultPrice`
   * or the `originalPrice` is set.
   */
  protected renderTaxMessage(): TemplateResult | void {
    const { defaultPrice, originalPrice } = this.$product()?.price ?? {};
    if (
      !this.$options().enableTaxMessage ||
      (!defaultPrice?.value && !originalPrice?.value)
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
