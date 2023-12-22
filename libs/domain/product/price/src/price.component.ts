import { ContentMixin, defaultOptions } from '@spryker-oryx/experience';
import {
  PRODUCT,
  ProductContext,
  ProductMixin,
  ProductPrice,
} from '@spryker-oryx/product';
import {
  computed,
  featureVersion,
  hydrate,
  signalProperty,
} from '@spryker-oryx/utilities';
import { LitElement, TemplateResult, html } from 'lit';
import { property } from 'lit/decorators.js';
import { ProductPriceOptions } from './price.model';
import { ProductPriceStyles, productPriceStyles } from './price.styles';

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
@hydrate({ context: featureVersion >= '1.4' ? PRODUCT : ProductContext.SKU })
export class ProductPriceComponent extends ProductMixin(
  ContentMixin<ProductPriceOptions>(LitElement)
) {
  static styles =
    featureVersion >= '1.2' ? productPriceStyles : ProductPriceStyles;

  /**
   * Indicates the sales price. If the sales price is not given by a property,
   * it will be resolved from the product data.
   *
   * @deprecated since 1.2.0. The sales price will only be resolved from the product data going forward.
   */
  @signalProperty() sales?: number;

  /**
   * The component uses the `PriceComponent` to render prices in the active currency.
   * If a currency is provided, the price currency must match this currency, otherwise the price
   * is not rendered.
   *
   * @deprecated since 1.2.0. The currency will be resolved from the (global) current currency going forward.
   */
  @property() currency?: string;

  /**
   * @deprecated since 1.2.0.
   */
  protected $salesPrice = computed(() => {
    if (this.sales) return this.sales;

    const { defaultPrice, originalPrice } = this.$product()?.price ?? {};

    if (defaultPrice) {
      return this.isValid(defaultPrice) && defaultPrice.value;
    } else {
      return this.isValid(originalPrice) && originalPrice?.value;
    }
  });

  /**
   * @deprecated since 1.2.0. The original price will be resolved from the product data going forward,
   * which makes the use of this signal obsolete.
   */
  protected $originalPrice = computed(() => {
    const { defaultPrice, originalPrice } = this.$product()?.price ?? {};

    if (this.sales && !originalPrice && this.sales !== defaultPrice?.value) {
      return this.isValid(defaultPrice) && defaultPrice?.value;
    } else {
      return this.isValid(originalPrice) && originalPrice?.value;
    }
  });

  /**
   * @deprecated since 1.2.0. The original price will be resolved from the product data going forward,
   * which makes the use of this signal obsolete.
   */
  protected isValid(price?: ProductPrice): boolean {
    return !this.currency || this.currency === price?.currency;
  }

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
    if (featureVersion >= '1.2') {
      const { defaultPrice, originalPrice } = this.$product()?.price ?? {};
      const price = defaultPrice?.value ? defaultPrice : originalPrice;

      if (!price) return;

      return html`<oryx-site-price
        .value=${price.value}
        .currency=${price.currency}
        part="sales"
        ?discounted=${originalPrice?.value &&
        defaultPrice?.value !== originalPrice?.value}
      ></oryx-site-price>`;
    } else {
      const price = this.$salesPrice();
      if (!price) return;

      return html`<oryx-site-price
        .value=${price}
        .currency=${this.currency}
        part="sales"
        ?has-discount=${!!this.$originalPrice()}
      ></oryx-site-price>`;
    }
  }

  /**
   * When the `enableOriginalPrice` option is `true` and the original price
   * is different from the sales price, the original price is rendered.
   */
  protected renderOriginalPrice(): TemplateResult | void {
    if (featureVersion >= '1.2') {
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
    } else {
      const price = this.$originalPrice();
      if (!price) return;

      return html`<oryx-site-price
        .value=${price}
        .currency=${this.currency}
        part="original"
      ></oryx-site-price>`;
    }
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
          this.$product()?.price?.defaultPrice?.isNet
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
