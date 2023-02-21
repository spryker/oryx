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
import { when } from 'lit/directives/when.js';
import { combineLatest, map } from 'rxjs';
import { OrderEntriesOptions } from './entries.model';
import { styles } from './entries.styles';

@defaultOptions({
  limit: 5,
  threshold: 3,
})
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
      if (!order || !options.limit || typeof options.threshold !== 'number') {
        return false;
      }
      const hasThreshold =
        order.items.length < options.limit + options.threshold;
      this.showAllEntries = hasThreshold ? true : this.showAllEntries;
      return hasThreshold;
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
    return html`<oryx-heading .appearance=${HeadingTag.H6}>
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
            this.showAllEntries
              ? this.order.items.length
              : this.componentOptions?.limit
          ),
          (entry) =>
            html`<cart-entry
              .options=${{
                ...entry,
                readonly: true,
                productOptions: false,
                calculations: {
                  unitPrice: entry.unitPrice,
                  sumPrice: entry.sumPrice,
                  sumPriceToPayAggregation: entry.sumPriceToPayAggregation,
                },
              }}
            ></cart-entry>`
        )}`
      : html``;
  }

  protected renderButton(): TemplateResult {
    return html`${when(
      !this.hasThreshold,
      () => html`<button @click=${this.toggleShowMore}>
        ${this.showAllEntries ? '-' : '+'}${this.order!.items.length -
        (this.componentOptions?.limit ?? 0)}
        ${i18n(
          this.showAllEntries ? 'order.less-products' : 'order.more-products'
        )}
      </button>`
    )}`;
  }

  protected toggleShowMore(): void {
    this.showAllEntries = !this.showAllEntries;
  }
}
