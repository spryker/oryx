import { ContextController } from '@spryker-oryx/core';
import { resolve } from '@spryker-oryx/di';
import { ContentMixin, defaultOptions } from '@spryker-oryx/experience';
import {
  ProductContext,
  ProductMediaContainerSize,
} from '@spryker-oryx/product';
import { PricingService } from '@spryker-oryx/site';
import { i18n } from '@spryker-oryx/utilities';
import { html, LitElement, PropertyValueMap, TemplateResult } from 'lit';
import { when } from 'lit-html/directives/when.js';
import { property, state } from 'lit/decorators.js';
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

  @property() available?: number;
  @property() key?: string;

  @state() protected entry?: CartEntry;

  protected context = new ContextController(this);
  protected pricingService = resolve(PricingService);

  @state() formattedPrice?: string;

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
      <oryx-product-media
        .options=${{ containerSize: ProductMediaContainerSize.Thumbnail }}
      ></oryx-product-media>
      <div class="details">
        <oryx-product-title .options=${{ link: true }}></oryx-product-title>

        ${when(
          this.componentOptions?.enableSku,
          () => html`<oryx-product-id></oryx-product-id>`
        )}
      </div>

      <div class="actions">
        <oryx-icon-button>
          <button aria-label="remove" @click=${this.onRemove}>
            <oryx-icon type="trash"></oryx-icon>
          </button>
        </oryx-icon-button>
      </div>

      <div class="price">
        <oryx-cart-quantity-input
          .min=${!this.componentOptions?.removeByQuantity ? 1 : 0}
          .max=${this.available ?? Infinity}
          .value=${this.entry?.quantity}
          .decreaseIcon=${this.decreaseIcon}
          submitOnChange
          @submit=${this.onSubmit}
        ></oryx-cart-quantity-input>
        <oryx-heading tag="h6" sm-appearance="h3"
          >${this.formattedPrice}</oryx-heading
        >
        <div class="item-price">
          <span>${i18n('cart.entry.item-price')}</span>
          <oryx-product-price
            .options=${{ enableVatMessage: false }}
          ></oryx-product-price>
        </div>
      </div>
    `;
  }

  protected onSubmit(e: CustomEvent<QuantityEventDetail>): void {
    e.stopPropagation();
    if (this.entry?.quantity !== undefined) {
      this.dispatchSubmitEvent(this.entry.quantity);
    }
  }

  protected onRemove(): void {
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

  // <!-- ?disabled=${this.disabled || this.options?.disabled} -->

  //
  // protected options$ = new ContentController(this).getOptions();

  // protected triggerConfirmationRequired$ = new BehaviorSubject(false);
  // protected confirmation$ = combineLatest([
  //   this.triggerConfirmationRequired$,
  //   this.options$,
  // ]).pipe(
  //   map(([confirmationRequired, entry]) => ({ confirmationRequired, entry }))
  // );

  // protected triggerShowOptions$ = new Subject<boolean>();
  // protected showOptions$ = merge(
  //   this.triggerShowOptions$,
  //   this.options$.pipe(
  //     take(1),
  //     map(({ defaultExpandedOptions }) => !!defaultExpandedOptions)
  //   )
  // );

  // protected toggleOptions(e: CustomEvent): void {
  //   this.triggerShowOptions$.next(e.detail.state);
  // }

  // protected dispatchRemoveEvent(): void {
  //   this.dispatchEvent(
  //     new CustomEvent(REMOVE_EVENT, { bubbles: true, composed: true })
  //   );
  // }

  // protected onQuantityChange(
  //   e: CustomEvent<QuantityEventDetail>,
  //   isInstant: boolean
  // ): void {
  //   if (e.detail.quantity === 0) {
  //     e.stopPropagation();

  //     if (isInstant) {
  //       this.dispatchRemoveEvent();
  //       return;
  //     }

  //     this.triggerConfirmationRequired$.next(true);
  //   }
  // }

  // protected onCancelRemoving(): void {
  //   this.triggerConfirmationRequired$.next(false);
  // }

  // protected override render(): TemplateResult {
  //   return html`${asyncValue(this.options$, (entry) => {
  //     const { hidePreview, silentRemove, selectedProductOptions } = entry;

  //     const hasOptions = !!selectedProductOptions?.length;

  //     return html`
  //       ${asyncValue(this.confirmation$, ({ confirmationRequired, entry }) => {
  //         if (entry.readonly) {
  //           return html``;
  //         }

  //         return html`${when(
  //           confirmationRequired,
  //           () => html`
  //             <cart-entry-confirmation
  //               .options=${entry}
  //               @remove=${(): void =>
  //                 this.onRemove(entry.silentRemove || confirmationRequired)}
  //               @cancel=${this.onCancelRemoving}
  //             ></cart-entry-confirmation>
  //           `,
  //           () => html`
  //             <oryx-icon-button size="small">
  //               <button
  //                 @click=${(): void =>
  //                   this.onRemove(entry.silentRemove || confirmationRequired)}
  //                 aria-label="remove"
  //               >
  //                 <oryx-icon
  //                   .type=${entry.removeButtonIcon ?? 'close'}
  //                 ></oryx-icon>
  //               </button>
  //             </oryx-icon-button>
  //           `
  //         )}`;
  //       })}

  //       <div class="entry">
  //         ${when(
  //           !hidePreview,
  //           () => html`
  //             <oryx-product-media
  //               .options=${{
  //                 containerSize: ProductMediaContainerSize.Thumbnail,
  //               }}
  //             ></oryx-product-media>
  //           `
  //         )}

  //         <section>
  //           <cart-entry-content
  //             .options=${entry}
  //             ?disabled=${asyncValue(this.triggerConfirmationRequired$)}
  //             @submit=${(e: CustomEvent): void =>
  //               this.onQuantityChange(e, !!silentRemove)}
  //           ></cart-entry-content>

  //           ${when(
  //             hasOptions,
  //             () =>
  //               html`
  //                 <cart-entry-options
  //                   .options=${entry}
  //                   ?show-options=${asyncValue(this.showOptions$)}
  //                   @toggle=${this.toggleOptions}
  //                 ></cart-entry-options>
  //               `
  //           )}
  //         </section>
  //       </div>

  //       <cart-entry-totals .options=${entry}></cart-entry-totals>
  //     `;
  //   })}`;
  // }
}
