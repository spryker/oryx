import { ContentMixin, defaultOptions } from '@spryker-oryx/experience';
import { ProductMixin } from '@spryker-oryx/product';
import { AlertType } from '@spryker-oryx/ui';
import { computed, hydratable, i18n } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import {
  CartItemAvailabilityOptions,
  StockAvailability,
} from './availability.model';
import { availabilityStyles } from './availability.styles';

@hydratable()
@defaultOptions({ threshold: 5, enableIndicator: true })
export class ProductAvailabilityComponent extends ProductMixin(
  ContentMixin<CartItemAvailabilityOptions>(LitElement)
) {
  static styles = availabilityStyles;

  protected status = computed(() => {
    const { isNeverOutOfStock, quantity, availability } =
      this.$product()?.availability ?? {};
    const { threshold } = this.$options();
    if (
      isNeverOutOfStock ||
      (!quantity && availability) ||
      (quantity && threshold && quantity > threshold)
    ) {
      return StockAvailability.InStock;
    }

    if (quantity && threshold && quantity <= threshold) {
      return StockAvailability.LowStock;
    }

    return StockAvailability.OutOfStock;
  });

  protected override render(): TemplateResult | void {
    return html`${this.renderIndicator()}${this.renderText()}`;
  }

  protected renderIndicator(): TemplateResult | void {
    if (!this.$options().enableIndicator) return;

    switch (this.status()) {
      case StockAvailability.InStock:
        return html`<oryx-swatch .type=${AlertType.Success}></oryx-swatch>`;
      case StockAvailability.LowStock:
        return html`<oryx-swatch .type=${AlertType.Warning}></oryx-swatch>`;
      default:
        return html`<oryx-swatch .type=${AlertType.Error}></oryx-swatch>`;
    }
  }

  protected renderText(): TemplateResult | void {
    const stock = this.status();
    const availableQuantity = this.$product()?.availability?.quantity;

    if (stock === StockAvailability.OutOfStock)
      return html`${i18n('product.availability.none')}`;

    if (this.$options().enableExactStock && availableQuantity) {
      if (stock === StockAvailability.LowStock)
        return html`${i18n('product.availability.limited-<stock>', {
          stock: availableQuantity,
        })}`;
      if (stock === StockAvailability.InStock)
        return html`${i18n('product.availability.available-<stock>', {
          stock: availableQuantity,
        })}`;
    }

    if (stock === StockAvailability.LowStock)
      return html`${i18n('product.availability.limited')}`;
    if (stock === StockAvailability.InStock)
      return html`${i18n('product.availability.available')}`;
  }
}
