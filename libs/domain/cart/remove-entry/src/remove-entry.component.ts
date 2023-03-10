import { CartComponentMixin, CartService } from '@spryker-oryx/cart';
import { resolve } from '@spryker-oryx/di';
import { ContentMixin, defaultOptions } from '@spryker-oryx/experience';
import { NotificationService } from '@spryker-oryx/site';
import { AlertType, Size } from '@spryker-oryx/ui';
import { ModalComponent } from '@spryker-oryx/ui/modal';
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
  protected notificationService = resolve(NotificationService);

  // protected productService = resolve(ProductService);
  // protected productController = new ProductController(this);

  @property() groupKey?: string;

  @state() protected requiresConfirmation?: boolean;
  @state() protected startRemoving?: boolean;

  // @asyncState()
  // protected productName = valueType(this.productService.get().pipe(map(product => product?.name)))

  protected override render(): TemplateResult | void {
    if (!this.groupKey) return;

    return html`<slot>
        <oryx-icon-button size=${Size.Md} @click=${this.onRequestRemove}>
          <button aria-label="remove">
            <oryx-icon type="trash"></oryx-icon>
          </button>
          <span style="display:var(--oryx-screen-small-inline, none)"
            >${i18n('cart.remove')}</span
          >
        </oryx-icon-button>
      </slot>

      ${when(this.requiresConfirmation, () => this.renderConfirmation())}`;
  }

  protected renderConfirmation(): TemplateResult {
    return html`<oryx-modal
      enableFooter
      heading=${i18n('cart.entry.confirm-remove')}
      open
    >
      ${i18n(`cart.entry.confirm-remove-<item>`, { item: '"entry name"' })}
      <oryx-button
        slot="footer-more"
        type="primary"
        size=${Size.Md}
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
            this.notificationService.push({
              type: AlertType.Success,
              content: i18n('cart.entry.<item>-removed-success', {
                item: this.groupKey,
              }) as string,
            });
          })
        )
        .subscribe();
    }
  }

  protected success(): void {
    this.startRemoving = false;
    this.shadowRoot?.querySelector<ModalComponent>('oryx-modal')?.close();
  }
}
