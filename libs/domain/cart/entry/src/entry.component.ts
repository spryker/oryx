import { ContextController } from '@spryker-oryx/core';
import { resolve } from '@spryker-oryx/di';
import { ContentMixin, defaultOptions } from '@spryker-oryx/experience';
import {
  ProductContext,
  ProductMediaContainerSize,
  ProductMixin,
} from '@spryker-oryx/product';
import { RouteType } from '@spryker-oryx/router';
import {
  LinkService,
  NotificationService,
  PricingService,
} from '@spryker-oryx/site';
import { AlertType } from '@spryker-oryx/ui';
import { ButtonColor, ButtonSize, ButtonType } from '@spryker-oryx/ui/button';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { LinkType } from '@spryker-oryx/ui/link';
import {
  Size,
  computed,
  elementEffect,
  hydrate,
  signalProperty,
} from '@spryker-oryx/utilities';
import { LitElement, TemplateResult, html } from 'lit';
import { property, state } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import {
  QuantityEventDetail,
  QuantityInputComponent,
} from '../../quantity-input/src';
import { CartComponentMixin } from '../../src/mixins';
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
@defaultOptions({
  removeByQuantity: RemoveByQuantity.ShowBin,
  enableItemImage: true,
  enableItemId: true,
  enableItemPrice: true,
  confirmBeforeRemove: true,
} as CartEntryOptions)
@hydrate()
export class CartEntryComponent
  extends ProductMixin(
    CartComponentMixin(ContentMixin<CartEntryOptions>(LitElement))
  )
  implements CartEntryAttributes
{
  static styles = [cartEntryStyles];

  @signalProperty({ type: Number }) quantity?: number;
  @property() key?: string;
  @property({ type: Number }) price?: number;
  @property({ type: Boolean }) readonly?: boolean;

  @state() protected requiresRemovalConfirmation?: boolean;

  protected pricingService = resolve(PricingService);
  protected contextController = new ContextController(this);

  protected $availableQuantity = computed(() => {
    const availability = this.$product()?.availability;
    return availability?.isNeverOutOfStock
      ? Infinity
      : availability?.quantity ?? Infinity;
  });

  @elementEffect()
  protected setProductContext = (): void => {
    if (this.sku) {
      this.contextController.provide(ProductContext.SKU, this.sku);
    }
  };

  protected cartService = resolve(CartService);
  protected notificationService = resolve(NotificationService);
  protected semanticLinkService = resolve(LinkService);

  protected $productLink = computed(() => {
    return this.semanticLinkService.get({
      type: RouteType.Product,
      id: this.$product()?.sku,
    });
  });

  protected override render(): TemplateResult | void {
    return html`
      ${this.renderPreview()} ${this.renderDetails()} ${this.renderActions()}
      ${this.renderPricing()}
      ${when(this.requiresRemovalConfirmation, () => this.renderConfirmation())}
    `;
  }

  protected renderPreview(): TemplateResult | void {
    if (!this.$options()?.enableItemImage) return;

    return html`
      <a href=${this.$productLink()}>
        <oryx-product-media
          .options=${{ containerSize: ProductMediaContainerSize.Thumbnail }}
        ></oryx-product-media>
      </a>
    `;
  }

  protected renderDetails(): TemplateResult | void {
    return html`<section class="details">
      <oryx-product-title
        .options=${{ linkType: LinkType.Neutral }}
      ></oryx-product-title>

      ${when(
        this.$options()?.enableItemId,
        () => html`<oryx-product-id></oryx-product-id>`
      )}
    </section>`;
  }

  protected renderActions(): TemplateResult | void {
    if (this.readonly) return;

    return html`
      <div class="actions">
        <oryx-button
          .type=${ButtonType.Icon}
          .size=${ButtonSize.Md}
          .icon=${IconTypes.Trash}
          .label=${this.i18n('remove')}
          ?disabled=${this.$isBusy()}
          @click=${this.removeEntry}
        ></oryx-button>
      </div>
    `;
  }

  protected renderPricing(): TemplateResult | void {
    const qtyTemplate = this.readonly
      ? this.i18n('cart.entry.<quantity>-items', {
          quantity: this.quantity,
        })
      : html`<oryx-cart-quantity-input
          .min=${Number(
            this.$options().removeByQuantity === RemoveByQuantity.NotAllowed
          )}
          .max=${this.$availableQuantity()}
          .value=${this.quantity}
          .decreaseIcon=${this.decreaseIcon()}
          submitOnChange
          @submit=${this.onSubmit}
          ?disabled=${this.$isBusy()}
        ></oryx-cart-quantity-input>`;

    return html`
      <section class="pricing">
        ${qtyTemplate}
        <oryx-site-price .value=${this.price}></oryx-site-price>
        ${when(
          this.$options()?.enableItemPrice,
          () =>
            html`<div class="item-price">
              <span>${this.i18n('cart.entry.item-price')}</span
              ><oryx-product-price
                .options=${{ enableTaxMessage: false }}
              ></oryx-product-price>
            </div>`
        )}
      </section>
    `;
  }

  protected renderConfirmation(): TemplateResult | void {
    return html`<oryx-modal
      open
      enableFooter
      enableCloseButtonInHeader
      minimal
      heading=${this.i18n('cart.entry.confirm')}
      @oryx.close=${() => this.revert()}
    >
      ${this.i18n(`cart.entry.confirm-remove-<sku>`, { sku: this.sku })}

      <oryx-button
        slot="footer-more"
        .color=${ButtonColor.Error}
        .size=${Size.Md}
        ?loading=${this.$isBusy()}
        @click=${(ev: Event) => this.removeEntry(ev, true)}
      >
        <button slot="custom" value="remove">
          ${this.i18n(`cart.entry.remove`)}
        </button>
      </oryx-button>
    </oryx-modal>`;
  }

  /**
   * Forces a revert of the quantity, as the quantity input might be updated outside.
   */
  protected revert(e?: Error): void {
    this.requiresRemovalConfirmation = false;
    const el = this.shadowRoot?.querySelector<QuantityInputComponent>(
      'oryx-cart-quantity-input'
    );
    if (el) el.value = this.quantity;
    if (e) throw e;
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
        if (this.$options().notifyOnUpdate) {
          this.notify('cart.cart-entry-updated', this.sku);
        }
      },
      error: (e: Error) => this.revert(e),
    });
  }

  protected removeEntry(ev: Event, force?: boolean): void {
    if (this.$options().confirmBeforeRemove && !force) {
      this.requiresRemovalConfirmation = true;
      return;
    }

    this.cartService.deleteEntry({ groupKey: this.key }).subscribe({
      next: () => {
        if (this.$options().notifyOnRemove) {
          this.notify('cart.confirm-removed', this.sku);
        }
      },
      error: (e: Error) => this.revert(e),
    });
  }

  protected notify(token: string, sku?: string): void {
    this.notificationService.push({
      type: AlertType.Success,
      content: this.i18n(token) as string,
      subtext: html`<oryx-product-title .sku=${sku}></oryx-product-title>`,
    });
  }

  protected decreaseIcon = computed(() =>
    this.$options().removeByQuantity === RemoveByQuantity.ShowBin &&
    this.quantity === 1
      ? IconTypes.Trash
      : undefined
  );
}
