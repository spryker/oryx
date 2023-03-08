import { CartComponentMixin, CartService } from '@spryker-oryx/cart';
import { resolve } from '@spryker-oryx/di';
import { ContentMixin, defaultOptions } from '@spryker-oryx/experience';
import { ProductService } from '@spryker-oryx/product';
import { NotificationService } from '@spryker-oryx/site';
import { ModalComponent } from '@spryker-oryx/ui/modal';
import { Types } from '@spryker-oryx/ui/notification';
import { hydratable, i18n } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { tap } from 'rxjs';
import { CartEntryRemoveOptions } from './remove-entry.model';

@defaultOptions({
  silentRemove: false,
} as CartEntryRemoveOptions)
@hydratable('window:load')
export class CartEntryRemoveComponent extends CartComponentMixin(
  ContentMixin<CartEntryRemoveOptions>(LitElement)
) {
  protected cartService = resolve(CartService);
  protected productService = resolve(ProductService);

  protected notificationService = resolve(NotificationService);

  @property() groupKey?: string;

  @state() protected requiresConfirmation?: boolean;
  @state() protected startRemoving?: boolean;

  protected override render(): TemplateResult | void {
    if (!this.groupKey) return;

    return html`<slot>
        <oryx-icon-button size="small" @click=${this.onRequestRemove}>
          <button aria-label="remove">
            <oryx-icon type="trash"></oryx-icon>
          </button>
          ${i18n('cart.remove')}
        </oryx-icon-button>
      </slot>

      ${when(this.requiresConfirmation, () => this.renderConfirmation())}`;
  }

  protected renderConfirmation(): TemplateResult {
    return html`<oryx-modal
      enableFooter
      enableCloseButtonInHeader
      heading=${i18n('cart.entry.confirm-remove')}
      open
    >
      ${i18n(`cart.entry.confirm-remove-<item>`, { item: '"entry name"' })}
      <oryx-button
        slot="footer-more"
        type="primary"
        size="small"
        @click=${this.onRemove}
        ?loading=${this.startRemoving}
      >
        <button value="remove">${i18n(`cart.entry.remove`)}</button>
      </oryx-button>
    </oryx-modal>`;
  }

  protected onRequestRemove(): void {
    if (this.componentOptions.silentRemove) {
      this.onRemove();
      return;
    }

    if (!this.requiresConfirmation) {
      this.requiresConfirmation = true;
    } else {
      this.shadowRoot?.querySelector<ModalComponent>('oryx-modal')?.open();
    }
  }

  protected onRemove(): void {
    if (this.groupKey) {
      this.startRemoving = true;
      this.cartService
        .deleteEntry({ groupKey: this.groupKey })
        .pipe(
          tap(() => {
            console.log('removed?');

            this.notificationService.push({
              type: Types.SUCCESS,
              content: 'Removed',
              subtext: 'message...',
            });
          })
        )
        .subscribe();
      // .subscribe(() => this.success);
    }
  }

  protected success(): void {
    this.startRemoving = false;
    this.shadowRoot?.querySelector<ModalComponent>('oryx-modal')?.close();
  }
}
