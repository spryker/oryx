import { ButtonColor, ButtonSize, ButtonType } from '@spryker-oryx/ui/button';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { AddressMixin } from '@spryker-oryx/user';
import { I18nMixin, Size, hydrate } from '@spryker-oryx/utilities';
import { LitElement, TemplateResult, html } from 'lit';
import { state } from 'lit/decorators.js';
import { tap } from 'rxjs';
import { styles } from './address-remove.styles';

@hydrate({ event: ['mouseover', 'focusin'] })
export class UserAddressRemoveComponent extends I18nMixin(
  AddressMixin(LitElement)
) {
  static styles = styles;

  @state() protected requestsConfirmation = false;
  // TODO: resolve loading state from central place
  @state() protected loading = false;

  protected override render(): TemplateResult | void {
    return html`
      <oryx-button
        .type=${ButtonType.Icon}
        .size=${ButtonSize.Md}
        .label=${this.i18n('user.address.remove')}
        .icon=${IconTypes.Trash}
        @click=${this.onConfirm}
      ></oryx-button>
      ${this.renderRemoveConfirmationModal()}
    `;
  }

  protected onConfirm(): void {
    this.requestsConfirmation = true;
  }

  protected renderRemoveConfirmationModal(): TemplateResult | void {
    if (!this.requestsConfirmation) return;

    return html`<oryx-modal
      open
      .heading=${this.i18n('checkout.address.remove-address')}
      @oryx.close=${this.onClose}
      @oryx.modal.closed=${this.onClose}
      enableFooter
    >
      <oryx-user-address .addressId=${this.$addressId()}></oryx-user-address>
      <section>
        <oryx-icon .type=${IconTypes.Info} size=${Size.Md}></oryx-icon>
        <span> ${this.i18n('user.address.remove-info')} </span>
      </section>
      <oryx-button
        slot="footer-more"
        .color=${ButtonColor.Error}
        .size=${ButtonSize.Md}
        .text=${this.i18n('user.address.remove')}
        ?loading=${this.loading}
        @click=${this.onRemove}
      ></oryx-button>
    </oryx-modal>`;
  }

  protected onRemove(): void {
    this.loading = true;
    const address = this.$address();
    if (address) {
      this.addressService
        .delete(address)
        .pipe(
          tap(() => {
            this.loading = false;
            this.requestsConfirmation = false;
          })
        )
        .subscribe();
    }
  }

  protected onClose(e: Event): void {
    e.stopPropagation();
    this.requestsConfirmation = false;
  }
}
