import { ContextController } from '@spryker-oryx/core';
import { ComponentMixin, ContentController } from '@spryker-oryx/experience';
import { asyncValue, subscribe } from '@spryker-oryx/lit-rxjs';
import { ProductContext } from '@spryker-oryx/product';
import { html, TemplateResult } from 'lit';
import { when } from 'lit-html/directives/when.js';
import { BehaviorSubject, map, merge, Subject, take, tap } from 'rxjs';
import { CartEntryOptions, REMOVE_EVENT } from './entry.model';
import { baseStyles, styles } from './styles';

export class CartEntryComponent extends ComponentMixin<CartEntryOptions>() {
  static styles = [baseStyles, styles];

  protected context = new ContextController(this);
  protected options$ = new ContentController(this).getOptions();

  protected triggerConfirmationRequired$ = new BehaviorSubject(false);

  protected triggerShowOptions$ = new Subject<boolean>();
  protected showOptions$ = merge(
    this.triggerShowOptions$,
    this.options$.pipe(
      take(1),
      map(({ defaultExpandedOptions }) => !!defaultExpandedOptions)
    )
  );

  @subscribe()
  protected sku$ = this.options$.pipe(
    tap(({ sku }) => {
      this.context.provide(ProductContext.SKU, sku);
    })
  );

  protected toggleOptions(e: CustomEvent): void {
    this.triggerShowOptions$.next(e.detail.state);
  }

  protected dispatchRemoveEvent(): void {
    this.dispatchEvent(
      new CustomEvent(REMOVE_EVENT, { bubbles: true, composed: true })
    );
  }

  protected onQuantityChange(e: CustomEvent, isInstant: boolean): void {
    if (e.detail.quantity === 0) {
      e.stopPropagation();

      if (isInstant) {
        this.dispatchRemoveEvent();
        return;
      }

      this.triggerConfirmationRequired$.next(true);
    }
  }

  protected onRemove(instant: boolean): void {
    if (instant) {
      this.dispatchRemoveEvent();
      this.triggerConfirmationRequired$.next(false);
      return;
    }

    this.triggerConfirmationRequired$.next(true);
  }

  protected onCancelRemoving(): void {
    this.triggerConfirmationRequired$.next(false);
  }

  protected override render(): TemplateResult {
    return html`${asyncValue(this.options$, (entry) => {
      const {
        hidePreview,
        silentRemove,
        removeButtonIcon,
        selectedProductOptions,
      } = entry;

      const hasOptions = !!selectedProductOptions?.length;

      return html`
        ${asyncValue(
          this.triggerConfirmationRequired$,
          (confirmationRequired) =>
            html`${when(
              confirmationRequired,
              () => html`
                <cart-entry-confirmation
                  .options=${entry}
                  @remove=${(): void =>
                    this.onRemove(silentRemove || confirmationRequired)}
                  @cancel=${this.onCancelRemoving}
                ></cart-entry-confirmation>
              `,
              () => html`
                <oryx-icon-button>
                  <button
                    @click=${(): void =>
                      this.onRemove(silentRemove || confirmationRequired)}
                    aria-label="remove"
                  >
                    <oryx-icon .type=${removeButtonIcon ?? 'close'}></oryx-icon>
                  </button>
                </oryx-icon-button>
              `
            )} `
        )}

        <div class="entry">
          ${when(
            !hidePreview,
            () => html`
              <product-media .options=${{ hdSrc: null }}></product-media>
            `
          )}

          <section>
            <cart-entry-content
              .options=${entry}
              ?disabled=${asyncValue(this.triggerConfirmationRequired$)}
              @oryx.quantity=${(e: CustomEvent): void =>
                this.onQuantityChange(e, !!silentRemove)}
            ></cart-entry-content>

            ${when(
              hasOptions,
              () =>
                html`
                  <cart-entry-options
                    .options=${entry}
                    ?show-options=${asyncValue(this.showOptions$)}
                    @toggle=${this.toggleOptions}
                  ></cart-entry-options>
                `
            )}
          </section>
        </div>

        <cart-entry-totals .options=${entry}></cart-entry-totals>
      `;
    })}`;
  }
}
