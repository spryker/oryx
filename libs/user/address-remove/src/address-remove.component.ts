import { ButtonType } from '@spryker-oryx/ui/button';
import { Size } from '@spryker-oryx/ui/utilities';
import { Address, AddressComponentMixin } from '@spryker-oryx/user';
import { hydratable } from '@spryker-oryx/utilities';
import { i18n } from '@spryker-oryx/utilities/i18n';
import { asyncValue } from '@spryker-oryx/utilities/lit-rxjs';
import { html, TemplateResult } from 'lit';
import { CANCEL_EVENT, CONFIRM_EVENT } from './address-remove.model';
import { styles } from './address-remove.styles';

@hydratable(['mouseover', 'focusin'])
export class AddressRemoveComponent extends AddressComponentMixin() {
  static styles = styles;

  protected emitEvent(event: string, address?: Address): void {
    this.dispatchEvent(
      new CustomEvent(event, {
        composed: true,
        bubbles: true,
        ...(address ? { detail: { address } } : {}),
      })
    );
  }

  protected override render(): TemplateResult {
    return html`${asyncValue(this.address$, (address) => {
      if (!address) {
        return html``;
      }

      return html`
        <oryx-user-address
          .addressId=${address.id}
          .options=${{ multiline: true }}
        ></oryx-user-address>
        <section>
          <oryx-icon type="info" size=${Size.medium}></oryx-icon>
          ${i18n(
            'user.address.removing-this-address-will-not-remove-any-pending-orders-being-dispatched-to-this-address'
          )}
        </section>
        ${this.renderControls(address)}
      `;
    })}`;
  }

  protected renderControls(address: Address): TemplateResult {
    return html`
      <oryx-button outline>
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
}
