import { ButtonType } from '@spryker-oryx/ui/button';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { Address, AddressMixin } from '@spryker-oryx/user';
import { hydratable, i18n, Size } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { CANCEL_EVENT, CONFIRM_EVENT } from './address-remove.model';
import { styles } from './address-remove.styles';

@hydratable(['mouseover', 'focusin'])
export class AddressRemoveComponent extends AddressMixin(LitElement) {
  static styles = styles;

  protected override render(): TemplateResult | void {
    const address = this.$address();
    if (!address) return;

    return html`
      <oryx-user-address .addressId=${address.id}></oryx-user-address>
      <section>
        <oryx-icon .type=${IconTypes.Info} size=${Size.Md}></oryx-icon>
        <span>
          ${i18n(
            'user.address.removing-this-address-will-not-remove-any-pending-orders-being-dispatched-to-this-address'
          )}
        </span>
      </section>
      ${this.renderControls(address)}
    `;
  }

  protected renderControls(address: Address): TemplateResult {
    return html`
      <oryx-button outline type=${ButtonType.Secondary}>
        <button @click=${(): void => this.emitEvent(CANCEL_EVENT)}>
          ${i18n('user.address.cancel')}
        </button>
      </oryx-button>

      <oryx-button type=${ButtonType.Critical}>
        <button @click=${(): void => this.emitEvent(CONFIRM_EVENT, address)}>
          ${i18n('user.address.remove')}
        </button>
      </oryx-button>
    `;
  }

  protected emitEvent(event: string, address?: Address): void {
    this.dispatchEvent(
      new CustomEvent(event, {
        composed: true,
        bubbles: true,
        ...(address ? { detail: { address } } : {}),
      })
    );
  }
}
