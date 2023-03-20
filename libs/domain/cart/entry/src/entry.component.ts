import { ContextController } from '@spryker-oryx/core';
import { resolve } from '@spryker-oryx/di';
import { ContentMixin, defaultOptions } from '@spryker-oryx/experience';
import {
  ProductContext,
  ProductMediaContainerSize,
} from '@spryker-oryx/product';
import {
  NotificationService,
  PricingService,
  SemanticLinkType,
} from '@spryker-oryx/site';
import { Size } from '@spryker-oryx/ui';
import { i18n } from '@spryker-oryx/utilities';
import { html, LitElement, PropertyValueMap, TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { take } from 'rxjs';
import { QuantityEventDetail } from '../../quantity-input/src';
import { CartComponentMixin } from '../../src/mixins';
import { CartEntry } from '../../src/models';
import {
  CartEntryChangeEventDetail,
  CartEntryOptions,
  RemoveByQuantity,
} from './entry.model';
import { cartEntryStyles } from './styles';

/**
 * Supports updating the quantity as well as removing the entry entirely.
 */
@defaultOptions({
  removeByQuantity: RemoveByQuantity.ShowBin,
  enableSku: true,
})
export class CartEntryComponent extends CartComponentMixin(
  ContentMixin<CartEntryOptions>(LitElement)
) {
  static styles = [cartEntryStyles];

  @property() key?: string;
  @property() available?: number;
  @property({ type: Boolean }) readonly?: boolean;

  @state() entry?: CartEntry;

  protected context = new ContextController(this);
  protected pricingService = resolve(PricingService);

  @state() formattedPrice?: string;

  protected notificationService = resolve(NotificationService);

  protected willUpdate(
    changedProperties: PropertyValueMap<unknown> | Map<PropertyKey, unknown>
  ): void {
    this.entry = this.entries?.find((entry) => entry.groupKey === this.key);
    if (this.entry) {
      this.context.provide(ProductContext.SKU, this.entry.sku);

      this.pricingService
        .format(this.entry?.calculations?.sumPrice)
        .pipe(take(1))
        .subscribe((formatted) => {
          if (formatted) {
            this.formattedPrice = formatted;
          }
        });
    }

    super.willUpdate(changedProperties);
  }

  protected override render(): TemplateResult | void {
    if (!this.entry) return;

    return html`
      <oryx-content-link
        .options=${{
          type: SemanticLinkType.Product,
          id: this.entry.sku,
          transparent: true,
        }}
      >
        <oryx-product-media
          .options=${{ containerSize: ProductMediaContainerSize.Thumbnail }}
        ></oryx-product-media>
      </oryx-content-link>

      ${this.renderDetails()} ${this.renderActions()} ${this.renderPricing()}
    `;
  }

  protected renderDetails(): TemplateResult | void {
    return html`<section class="details">
      <oryx-product-title .options=${{ link: true }}></oryx-product-title>

      ${when(
        this.componentOptions?.enableSku,
        () => html`<oryx-product-id></oryx-product-id>`
      )}
    </section>`;
  }

  protected renderActions(): TemplateResult | void {
    if (this.readonly) return;

    return html`
      <div class="actions">
        <oryx-icon-button size=${Size.Md} @click=${this.onRemove}>
          <button aria-label="remove">
            <oryx-icon type="trash"></oryx-icon>
          </button>
          <span style="display:var(--oryx-screen-small-inline, none)"
            >${i18n('cart.remove')}</span
          >
        </oryx-icon-button>
      </div>
    `;
  }

  protected renderPricing(): TemplateResult | void {
    if (this.readonly) {
      return html`
        <section class="pricing">
          ${i18n('cart.entry.<quantity>-items', {
            quantity: this.entry?.quantity,
          })}
          <span class="entry-price">${this.formattedPrice}</span>
        </section>
      `;
    }

    return html`
      <section class="pricing">
        <oryx-cart-quantity-input
          .min=${Number(!this.componentOptions?.removeByQuantity)}
          .max=${this.available ?? Infinity}
          .value=${this.entry?.quantity}
          .decreaseIcon=${this.decreaseIcon}
          submitOnChange
          @submit=${this.onSubmit}
        ></oryx-cart-quantity-input>
        <span class="entry-price">${this.formattedPrice}</span>
        <div class="item-price">
          <span>${i18n('cart.entry.item-price')}</span>
          <oryx-product-price
            .options=${{ enableVatMessage: false }}
          ></oryx-product-price>
        </div>
      </section>
    `;
  }

  protected onSubmit(e: CustomEvent<QuantityEventDetail>): void {
    e.stopPropagation();
    this.dispatchSubmitEvent(e.detail.quantity);
  }

  protected onRemove(e: Event): void {
    e.stopPropagation();
    this.dispatchSubmitEvent(0);
  }

  protected dispatchSubmitEvent(quantity: number): void {
    const { sku, groupKey } = this.entry ?? {};
    if (!groupKey || !sku) return;

    this.dispatchEvent(
      new CustomEvent<CartEntryChangeEventDetail>('submit', {
        detail: {
          quantity: quantity ?? this.entry?.quantity,
          groupKey,
          sku,
        },
        composed: true,
        bubbles: true,
      })
    );
  }

  protected get decreaseIcon(): string | void {
    if (
      this.componentOptions?.removeByQuantity === RemoveByQuantity.ShowBin &&
      this.entry?.quantity === 1
    ) {
      return 'trash';
    }
  }
}
