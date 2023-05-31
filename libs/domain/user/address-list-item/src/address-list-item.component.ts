import { ContentMixin } from '@spryker-oryx/experience';
import { AlertType } from '@spryker-oryx/ui';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { Address, AddressMixin } from '@spryker-oryx/user';
import { hydratable, i18n } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { when } from 'lit/directives/when.js';
import {
  AddressDefaults,
  AddressListItemAttributes,
  AddressListItemOptions,
  EDIT_EVENT,
  REMOVE_EVENT,
} from './address-list-item.model';
import { styles } from './address-list-item.styles';

@hydratable('window:load')
export class AddressListItemComponent
  extends AddressMixin(ContentMixin<AddressListItemOptions>(LitElement))
  implements AddressListItemAttributes
{
  static styles = styles;

  protected override render(): TemplateResult | void {
    if (!this.address()) return;

    if (this.$options()?.selectable) {
      return html`<oryx-radio>
        <slot></slot>${this.renderContent()}
      </oryx-radio>`;
    } else {
      return html`<section>${this.renderContent()}</section>`;
    }
  }

  protected renderContent(): TemplateResult | void {
    return html`
      <div>
        <oryx-user-address .addressId=${this.address()?.id}></oryx-user-address>
        ${this.renderActions()}
      </div>
      ${this.renderDefaults()}
    `;
  }

  protected renderActions(): TemplateResult | void {
    const address = this.address();
    const { editable, removable } = this.$options();
    if (!address || (!editable && !removable)) return;

    return html`<div class="controls">
      ${when(
        editable,
        () => html`
          <oryx-icon-button>
            <button
              aria-label=${i18n('user.address.edit')}
              @click=${(): void => this.emitEvent(EDIT_EVENT, address)}
            >
              <oryx-icon .type=${IconTypes.Edit}></oryx-icon>
            </button>
          </oryx-icon-button>
        `
      )}
      ${when(
        removable,
        () => html`
          <oryx-icon-button>
            <button
              aria-label=${i18n('user.address.remove')}
              @click=${(): void => this.emitEvent(REMOVE_EVENT, address)}
            >
              <oryx-icon .type=${IconTypes.Trash}></oryx-icon>
            </button>
          </oryx-icon-button>
        `
      )}
    </div>`;
  }

  protected renderDefaults(): TemplateResult | void {
    const address = this.address();
    const { addressDefaults } = this.$options();
    if (!address) return;

    const showAll = addressDefaults === AddressDefaults.All;
    const showBilling = addressDefaults === AddressDefaults.Billing;
    const showShipping = addressDefaults === AddressDefaults.Shipping;

    const defaultBilling = address.isDefaultBilling && (showAll || showBilling);
    const defaultShipping =
      address.isDefaultShipping && (showAll || showShipping);

    if (!defaultBilling && !defaultShipping) {
      return html``;
    }

    const chip = (token: string) =>
      html`<oryx-chip appearance=${AlertType.Success}
        >${i18n(token)}</oryx-chip
      >`;

    return html`<div slot="subtext">
      ${when(defaultShipping, () =>
        chip(showAll ? 'user.address.default-shipping' : 'user.address.default')
      )}
      ${when(defaultBilling, () =>
        chip(showAll ? 'user.address.default-billing' : 'user.address.default')
      )}
    </div>`;
  }

  protected emitEvent(event: string, address: Address): void {
    this.dispatchEvent(
      new CustomEvent(event, {
        bubbles: true,
        composed: true,
        detail: { address },
      })
    );
  }
}
