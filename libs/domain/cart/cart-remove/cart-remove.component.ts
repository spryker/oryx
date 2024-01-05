import { ButtonColor, ButtonSize, ButtonType } from '@spryker-oryx/ui/button';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { I18nMixin, Size, hydrate } from '@spryker-oryx/utilities';
import { LitElement, TemplateResult, html } from 'lit';
import { state } from 'lit/decorators.js';
import { CartComponentMixin } from '../src/mixins';
import { resolve } from '@spryker-oryx/di';
import { CartService } from '@spryker-oryx/cart';
import { NotificationService } from '@spryker-oryx/site';
import { AlertType } from '@spryker-oryx/ui';

@hydrate({ event: ['mouseover', 'focusin'] })
export class CartRemoveComponent extends CartComponentMixin(
  I18nMixin(LitElement)
){
  protected cartService = resolve(CartService);
  protected notificationService = resolve(NotificationService);

  @state() protected requestsConfirmation = false;
  @state() protected isLoading = false;

  protected override render(): TemplateResult | void {
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
      <span>${this.i18n('cart.remove.remove-<name>-info', {name})} </span>
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
    const cartId = this.$cart()?.id;

    if (!cartId) return;

    this.isLoading = true;
    const name = this.$cart()?.name;

    this.cartService.deleteCart({cartId}).subscribe({
      next: () => {
        this.notificationService.push({
          type: AlertType.Error,
          content: this.i18n('carts.remove.cart-<name>-removed', { name }) as string
        });
        this.requestsConfirmation = false;
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  protected onCancel(e: Event): void {
    console.log('cancel');
    
    e.stopPropagation();
    this.requestsConfirmation = false;
  }
}
