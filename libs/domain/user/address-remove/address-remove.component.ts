import { ButtonType } from '@spryker-oryx/ui/button';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { AddressMixin } from '@spryker-oryx/user';
import { hydratable, i18n, Size } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { state } from 'lit/decorators.js';
import { tap } from 'rxjs';
import { styles } from './address-remove.styles';

@hydratable(['mouseover', 'focusin'])
export class UserAddressRemoveComponent extends AddressMixin(LitElement) {
  static styles = styles;

  @state() protected requestsConfirmation = false;
  @state() protected loading = false;

  protected override render(): TemplateResult | void {
    return html`
      <oryx-icon-button>
        <button
          aria-label=${i18n('user.address.remove')}
          @click=${this.onConfirm}
        >
          <oryx-icon .type=${IconTypes.Trash}></oryx-icon>
        </button>
      </oryx-icon-button>
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
      .heading=${i18n('checkout.address.remove-address')}
      @oryx.close=${this.onClose}
      enableFooter
    >
      <oryx-user-address .addressId=${this.$addressId()}></oryx-user-address>
      <section>
        <oryx-icon .type=${IconTypes.Info} size=${Size.Md}></oryx-icon>
        <span> ${i18n('user.address.remove-info')} </span>
      </section>
      <oryx-button
        slot="footer-more"
        type=${ButtonType.Critical}
        ?loading=${this.loading}
      >
        <button @click=${this.onRemove}>${i18n('user.address.remove')}</button>
      </oryx-button>
    </oryx-modal>`;
  }

  protected onRemove(): void {
    console.log('onRemove...');
    this.loading = true;
    const address = this.$address();
    console.log('address', address);
    if (address) {
      this.addressService
        .deleteAddress(address)
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
