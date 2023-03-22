import { ContextController } from '@spryker-oryx/core';
import { resolve } from '@spryker-oryx/di';
import { ContentMixin } from '@spryker-oryx/experience';
import {
  ProductContext,
  ProductMediaContainerSize,
} from '@spryker-oryx/product';
import {
  NotificationService,
  PricingService,
  SemanticLinkType,
} from '@spryker-oryx/site';
import { AlertType, Size } from '@spryker-oryx/ui';
import { ButtonType } from '@spryker-oryx/ui/button';
import { LinkType } from '@spryker-oryx/ui/link';
import { i18n } from '@spryker-oryx/utilities';
import { html, LitElement, PropertyValueMap, TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { take } from 'rxjs';
import {
  QuantityEventDetail,
  QuantityInputComponent,
} from '../../quantity-input/src';
import { CartComponentMixin } from '../../src/mixins';
import { CartEntry } from '../../src/models';
import { CartService } from '../../src/services';
import {
  CartEntryAttributes,
  CartEntryOptions,
  RemoveByQuantity,
} from './entry.model';
import { cartEntryStyles } from './styles';

/**
 * Supports updating the quantity as well as removing the entry entirely.
 */

export class CartEntryComponent
  extends CartComponentMixin(ContentMixin<CartEntryOptions>(LitElement))
  implements CartEntryAttributes
{
  static styles = [cartEntryStyles];

  @property() key?: string;
  @property({ type: Boolean }) readonly?: boolean;
  @property({ type: Number }) available?: number;

  @state() protected entry?: CartEntry;
  @state() protected formattedPrice?: string;
  @state() protected requiresRemovalConfirmation?: boolean;

  protected cartService = resolve(CartService);
  protected notificationService = resolve(NotificationService);
  protected context = new ContextController(this);
  protected pricingService = resolve(PricingService);

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
      ${this.renderPreview()} ${this.renderDetails()} ${this.renderActions()}
      ${this.renderPricing()}
      ${when(this.requiresRemovalConfirmation, () => this.renderConfirmation())}
    `;
  }

  protected renderPreview(): TemplateResult | void {
    if (!this.componentOptions?.enablePreview) return;

    return html`
      <oryx-content-link
        .options=${{
          type: SemanticLinkType.Product,
          id: this.entry?.sku,
          linkType: LinkType.Neutral,
        }}
      >
        <oryx-product-media
          .options=${{ containerSize: ProductMediaContainerSize.Thumbnail }}
        ></oryx-product-media>
      </oryx-content-link>
    `;
  }

  protected renderDetails(): TemplateResult | void {
    return html`<section class="details">
      <oryx-product-title
        .options=${{ linkType: LinkType.Neutral }}
      ></oryx-product-title>

      ${when(
        this.componentOptions?.enableId,
        () => html`<oryx-product-id></oryx-product-id>`
      )}
    </section>`;
  }

  protected renderActions(): TemplateResult | void {
    if (this.readonly) return;

    return html`
      <div class="actions">
        <oryx-icon-button
          size=${Size.Md}
          @click=${this.removeEntry}
          ?disabled=${this.isBusy}
        >
          <button aria-label="remove">
            <oryx-icon type="trash"></oryx-icon>
          </button>
          <span>${i18n('cart.remove')}</span>
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
          ?disabled=${this.isBusy}
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

  protected renderConfirmation(): TemplateResult | void {
    return html`<oryx-modal
      open
      enableFooter
      enableCloseButtonInHeader
      heading=${i18n('cart.entry.confirm')}
      @oryx.close=${this.revert}
    >
      ${i18n(`cart.entry.confirm-remove-<sku>`, { sku: this.entry?.sku })}

      <oryx-button
        slot="footer-more"
        .type=${ButtonType.Critical}
        .size=${Size.Md}
        @click=${(ev: Event) => this.removeEntry(ev, true)}
      >
        <button value="remove">${i18n(`cart.entry.remove`)}</button>
      </oryx-button>
    </oryx-modal>`;
  }

  /**
   * Forces a revert of the quantity, as the quantity input might be updated outside.
   */
  protected revert(): void {
    this.requiresRemovalConfirmation = false;
    const el = this.shadowRoot?.querySelector<QuantityInputComponent>(
      'oryx-cart-quantity-input'
    );
    if (el) {
      el.value = this.entry?.quantity;
    }
  }

  protected onSubmit(ev: CustomEvent<QuantityEventDetail>): void {
    const { quantity } = ev.detail;
    if (quantity > 0) {
      this.updateEntry(quantity);
    } else {
      this.removeEntry(ev);
    }
  }

  protected updateEntry(quantity: number): void {
    this.cartService.updateEntry({ groupKey: this.key, quantity }).subscribe({
      next: () => {
        if (this.componentOptions?.notifyOnUpdate) {
          this.notify('cart.cart-entry-updated', this.entry?.sku);
        }
      },
      error: () => this.revert(),
    });
  }

  protected removeEntry(ev: Event, force?: boolean): void {
    console.log(this.componentOptions?.confirmBeforeRemove, !force);
    if (this.componentOptions?.confirmBeforeRemove && !force) {
      this.requiresRemovalConfirmation = true;
      return;
    }

    this.cartService.deleteEntry({ groupKey: this.key }).subscribe({
      next: () => {
        if (this.componentOptions?.notifyOnRemove) {
          this.notify('cart.confirm-removed', this.entry?.sku);
        }
      },
      error: () => this.revert(),
    });
  }

  protected notify(token: string, sku?: string): void {
    this.notificationService.push({
      type: AlertType.Success,
      content: i18n(token) as string,
      subtext: html`<oryx-product-title .sku=${sku}></oryx-product-title>`,
    });
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
