import { ContentMixin, defaultOptions } from '@spryker-oryx/experience';
import { OrderMixin } from '@spryker-oryx/order';
import { HeadingTag } from '@spryker-oryx/ui/heading';
import { computed, hydrate } from '@spryker-oryx/utilities';
import { LitElement, TemplateResult, html } from 'lit';
import { property } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { OrderEntriesAttributes, OrderEntriesOptions } from './entries.model';
import { orderEntriesStyles } from './entries.styles';

@defaultOptions({
  limit: 5,
  threshold: 3,
  enableItemImage: true,
  enableItemId: true,
  enableItemPrice: false,
} as OrderEntriesOptions)
@hydrate({ event: 'window:load' })
export class OrderEntriesComponent
  extends OrderMixin(ContentMixin<OrderEntriesOptions>(LitElement))
  implements OrderEntriesAttributes
{
  static styles = orderEntriesStyles;

  @property({ type: Boolean }) expanded = false;

  protected $isLimited = computed(() => {
    const order = this.$order();
    const { limit = 0, threshold = 0 } = this.$options();

    return limit && order?.items.length > limit + threshold;
  });

  protected override render(): TemplateResult | void {
    if (!this.$order()) return;

    return html`
      ${this.renderHeading()} ${this.renderEntries()} ${this.renderButton()}
    `;
  }

  protected renderHeading(): TemplateResult {
    return html`<oryx-heading .as=${HeadingTag.H6}>
      <h3>
        ${this.i18n('order.<count>-items', {
          count: this.$order().items.length,
        })}
      </h3>
    </oryx-heading>`;
  }

  protected renderEntries(): TemplateResult {
    const order = this.$order();
    const options = this.$options();
    const showAll = !this.$isLimited() || this.expanded;

    return html`${repeat(
      showAll ? order.items : order.items.slice(0, options.limit),
      (entry) =>
        html`<oryx-cart-entry
          .key=${entry.uuid}
          .sku=${entry.sku}
          .quantity=${entry.quantity}
          .price=${entry.sumPrice}
          .options=${options}
          readonly
        ></oryx-cart-entry>`
    )}`;
  }

  protected renderButton(): TemplateResult | void {
    if (!this.$isLimited()) return;

    const restItemsCount = this.$order().items.length - this.$options().limit!;

    return html`<oryx-button type="text">
      <button @click=${this.toggle}>
        ${this.expanded ? '-' : '+'}${restItemsCount}
        ${this.i18n(
          this.expanded ? 'order.less-products' : 'order.more-products'
        )}
      </button>
    </oryx-button>`;
  }

  protected toggle(): void {
    this.expanded = !this.expanded;
  }
}
