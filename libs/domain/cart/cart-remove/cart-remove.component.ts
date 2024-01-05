import { CartService } from '@spryker-oryx/cart';
import { resolve } from '@spryker-oryx/di';
import { NotificationService } from '@spryker-oryx/site';
import { AlertType } from '@spryker-oryx/ui';
import { ButtonColor, ButtonSize, ButtonType } from '@spryker-oryx/ui/button';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { I18nMixin, hydrate } from '@spryker-oryx/utilities';
import { LitElement, TemplateResult, html } from 'lit';
import { state } from 'lit/decorators.js';
import { CartComponentMixin } from '../src/mixins';

@hydrate({ event: ['mouseover', 'focusin'] })
export class CartRemoveComponent extends CartComponentMixin(
  I18nMixin(LitElement)
) {
  protected cartService = resolve(CartService);
  protected notificationService = resolve(NotificationService);

  @state() protected requestsConfirmation = false;
  @state() protected isLoading = false;

  protected override render(): TemplateResult | void {
    if (!this.$cart()?.id) return;

    return html`
      <oryx-button
        .type=${ButtonType.Icon}
        .size=${ButtonSize.Md}
        .label=${this.i18n('carts.remove')}
        .icon=${IconTypes.Trash}
        @click=${this.onRemove}
      ></oryx-button>
      ${this.renderRemoveConfirmationModal()}
    `;
  }

  protected onRemove(): void {
    this.requestsConfirmation = true;
  }

  protected renderRemoveConfirmationModal(): TemplateResult | void {
    if (!this.requestsConfirmation) return;

    const name = this.$cart()?.name;

    return html`<oryx-modal
      ?open=${this.requestsConfirmation}
      .heading=${this.i18n('carts.remove.title.confirmation')}
      @oryx.modal.closed=${this.onCancel}
      enableFooter
    >
      <span>${this.i18n('cart.remove.remove-cart-<name>-info', { name })}</span>
      <oryx-button
        slot="footer-more"
        .color=${ButtonColor.Error}
        .size=${ButtonSize.Md}
        .text=${this.i18n('carts.remove.button.remove')}
        ?loading=${this.isLoading}
        @click=${this.onConfirm}
      ></oryx-button>
    </oryx-modal>`;
  }

  protected onConfirm(): void {
    this.isLoading = true;

    const cart = this.$cart();
    const name = cart?.name;
    const cartId = cart?.id;

    this.cartService.deleteCart({ cartId }).subscribe({
      next: () => {
        this.notificationService.push({
          type: AlertType.Error,
          content: {
            token: 'carts.remove.<name>-removed',
            values: { name },
          },
        });
        this.requestsConfirmation = false;
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  protected onCancel(e: Event): void {
    e.stopPropagation();
    this.requestsConfirmation = false;
  }
}
