import { ContentMixin, defaultOptions } from '@spryker-oryx/experience';
import { ProductMixin } from '@spryker-oryx/product';
import { AlertType } from '@spryker-oryx/ui';
import { computed, hydratable } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { when } from 'lit/directives/when.js';
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

  protected $status = computed(() => {
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
    return html`${when(
      this.$options().enableIndicator,
      () => html`<oryx-swatch .type=${this.getAlertType()}></oryx-swatch>`
    )}
    ${this.renderText()}`;
  }

  protected getAlertType(): AlertType {
    switch (this.$status()) {
      case StockAvailability.InStock:
        return AlertType.Success;
      case StockAvailability.LowStock:
        return AlertType.Warning;
      default:
        return AlertType.Error;
    }
  }

  protected renderText(): TemplateResult | void {
    const stock = this.$status();
    const availableQuantity = this.$product()?.availability?.quantity;

    if (stock === StockAvailability.OutOfStock)
      return html`${this.i18n('product.availability.none')}`;

    if (this.$options().enableExactStock && availableQuantity) {
      if (stock === StockAvailability.LowStock)
        return html`${this.i18n('product.availability.limited-<stock>', {
          stock: availableQuantity,
        })}`;
      if (stock === StockAvailability.InStock)
        return html`${this.i18n('product.availability.available-<stock>', {
          stock: availableQuantity,
        })}`;
    }

    if (stock === StockAvailability.LowStock)
      return html`${this.i18n('product.availability.limited')}`;
    if (stock === StockAvailability.InStock)
      return html`${this.i18n('product.availability.available')}`;
  }
}
