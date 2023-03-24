import { ContentMixin, defaultOptions } from '@spryker-oryx/experience';
import { OrderMixin } from '@spryker-oryx/order';
import { HeadingTag } from '@spryker-oryx/ui/heading';
import {
  asyncState,
  hydratable,
  i18n,
  valueType,
} from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { combineLatest, map } from 'rxjs';
import { OrderEntriesOptions } from './entries.model';
import { styles } from './entries.styles';

@defaultOptions({
  limit: 5,
  threshold: 3,
  enableItemImage: true,
  enableItemId: true,
  enableItemPrice: false,
} as OrderEntriesOptions)
@hydratable('window:load')
export class OrderEntriesComponent extends OrderMixin(
  ContentMixin<OrderEntriesOptions>(LitElement)
) {
  static styles = styles;

  @property()
  showAllEntries = false;

  protected order$ = this.orderController.getOrder();

  @asyncState()
  protected order = valueType(this.order$);

  protected hasThreshold$ = combineLatest([this.order$, this.options$]).pipe(
    map(([order, options]) => {
      if (!order || !options.limit || isNaN(options.threshold as any)) {
        return false;
      }
      return order.items.length < options.limit + options.threshold!;
    })
  );

  @asyncState()
  protected hasThreshold = valueType(this.hasThreshold$);

  protected hasEntries = false;

  protected override render(): TemplateResult {
    return this.order
      ? html`${this.renderHeading()} ${this.renderEntries()}
        ${this.renderButton()}`
      : html``;
  }

  protected renderHeading(): TemplateResult {
    return html`<oryx-heading .as=${HeadingTag.H6}>
      <h3>
        ${i18n('order.Products')}
        ${i18n('order.(<count> items)', {
          count: this.order?.items.length ?? 0,
        })}
      </h3>
    </oryx-heading>`;
  }

  protected renderEntries(): TemplateResult {
    return this.order
      ? html`${repeat(
          this.order.items.slice(
            0,
            this.hasThreshold || this.showAllEntries
              ? this.order.items.length
              : this.componentOptions?.limit
          ),
          (entry) =>
            html`<oryx-cart-entry
              .key=${entry.uuid}
              .sku=${entry.sku}
              .quantity=${entry.quantity}
              .price=${entry.sumPrice}
              .options=${this.componentOptions}
              readonly
            ></oryx-cart-entry>`
        )}`
      : html``;
  }

  protected renderButton(): TemplateResult | void {
    if (this.hasThreshold || !this.order) return;
    return html`<button @click=${this.toggleShowMore}>
      ${this.showAllEntries ? '-' : '+'}${this.order.items.length -
      (this.componentOptions?.limit ?? 0)}
      ${i18n(
        this.showAllEntries ? 'order.less-products' : 'order.more-products'
      )}
    </button>`;
  }

  protected toggleShowMore(): void {
    this.showAllEntries = !this.showAllEntries;
  }
}
