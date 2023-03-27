import { ContextController } from '@spryker-oryx/core';
import { resolve } from '@spryker-oryx/di';
import { ContentMixin, defaultOptions } from '@spryker-oryx/experience';
import {
  ProductContext,
  ProductMediaContainerSize,
  ProductService,
} from '@spryker-oryx/product';
import {
  NotificationService,
  PricingService,
  SemanticLinkType,
} from '@spryker-oryx/site';
import { AlertType, Size } from '@spryker-oryx/ui';
import { ButtonType } from '@spryker-oryx/ui/button';
import { LinkType } from '@spryker-oryx/ui/link';
import { asyncState, i18n, valueType } from '@spryker-oryx/utilities';
import { html, LitElement, PropertyValueMap, TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { filter, first, map, switchMap } from 'rxjs';
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
} as CartEntryOptions)
export class CartEntryComponent
  extends CartComponentMixin(ContentMixin<CartEntryOptions>(LitElement))
  implements CartEntryAttributes
{
  static styles = [cartEntryStyles];

  @property() sku?: string;
  @property({ type: Number }) quantity?: number;
  @property({ type: Number }) price?: number;

  @property() key?: string;
  @property({ type: Boolean }) readonly?: boolean;

  @state() protected formattedPrice?: string;
  @state() protected requiresRemovalConfirmation?: boolean;

  protected willUpdate(
    props: PropertyValueMap<CartEntryAttributes> | Map<PropertyKey, unknown>
  ): void {
    if (props.has('sku')) {
      this.context.provide(ProductContext.SKU, this.sku);
    }
    if (props.has('price')) {
      this.formatPrice();
    }
    super.willUpdate(props);
  }

  protected formatPrice(): void {
    this.pricingService
      .format(this.price)
      .pipe(first(Boolean))
      .subscribe((formatted) => (this.formattedPrice = formatted));
  }

  protected productService = resolve(ProductService);
  protected pricingService = resolve(PricingService);
  protected context = new ContextController(this);

  @asyncState()
  protected availableQuantity = valueType(
    this.context.get(ProductContext.SKU).pipe(
      filter(Boolean),
      switchMap((sku) =>
        this.productService
          .get({ sku: sku as string })
          .pipe(
            map((product) =>
              product?.availability?.isNeverOutOfStock
                ? Infinity
                : product?.availability?.quantity ?? Infinity
            )
          )
      )
    )
  );

  protected cartService = resolve(CartService);
  protected notificationService = resolve(NotificationService);

  protected override render(): TemplateResult | void {
    return html`
      ${this.renderPreview()} ${this.renderDetails()} ${this.renderActions()}
      ${this.renderPricing()}
      ${when(this.requiresRemovalConfirmation, () => this.renderConfirmation())}
    `;
  }

  protected renderPreview(): TemplateResult | void {
    if (!this.componentOptions?.enableItemImage) return;

    return html`
      <oryx-content-link
        .options=${{
          type: SemanticLinkType.Product,
          id: this.sku,
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
        this.componentOptions?.enableItemId,
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
    const qtyTemplate = this.readonly
      ? i18n('cart.entry.<quantity>-items', {
          quantity: this.quantity,
        })
      : html`<oryx-cart-quantity-input
          .min=${Number(
            this.componentOptions?.removeByQuantity ===
              RemoveByQuantity.NotAllowed
          )}
          .max=${this.availableQuantity}
          .value=${this.quantity}
          .decreaseIcon=${this.decreaseIcon}
          submitOnChange
          @submit=${this.onSubmit}
          ?disabled=${this.isBusy}
        ></oryx-cart-quantity-input>`;

    return html`
      <section class="pricing">
        ${qtyTemplate}
        <span class="entry-price">${this.formattedPrice}</span>

        ${when(
          this.componentOptions?.enableItemPrice,
          () =>
            html`<div class="item-price">
              <span>${i18n('cart.entry.item-price')}</span
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
      heading=${i18n('cart.entry.confirm')}
      @oryx.close=${this.revert}
    >
      ${i18n(`cart.entry.confirm-remove-<sku>`, { sku: this.sku })}

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
      el.value = this.quantity;
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
          this.notify('cart.cart-entry-updated', this.sku);
        }
      },
      error: () => this.revert(),
    });
  }

  protected removeEntry(ev: Event, force?: boolean): void {
    if (this.componentOptions?.confirmBeforeRemove && !force) {
      this.requiresRemovalConfirmation = true;
      return;
    }

    this.cartService.deleteEntry({ groupKey: this.key }).subscribe({
      next: () => {
        if (this.componentOptions?.notifyOnRemove) {
          this.notify('cart.confirm-removed', this.sku);
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
      this.quantity === 1
    ) {
      return 'trash';
    }
  }
}
