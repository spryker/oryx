import { resolve } from '@spryker-oryx/di';
import { ContentMixin } from '@spryker-oryx/experience';
import { Address, AddressService } from '@spryker-oryx/user';
import {
  AddressDefaults,
  AddressListItemOptions,
} from '@spryker-oryx/user/address-list-item';
import {
  asyncState,
  hydratable,
  i18n,
  valueType,
} from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { when } from 'lit-html/directives/when.js';
import { keyed } from 'lit/directives/keyed.js';
import { repeat } from 'lit/directives/repeat.js';
import { SELECT_EVENT } from './address-list.model';
import { styles } from './address-list.styles';

@hydratable('window:load')
export class AddressListComponent extends ContentMixin<AddressListItemOptions>(
  LitElement
) {
  static styles = styles;

  protected addressService = resolve(AddressService);

  @asyncState()
  protected addresses = valueType(this.addressService.getAddresses());

  protected selectedAddressId?: string;

  protected onChange(ev: Event): void {
    const el = ev.target as HTMLInputElement;

    const address = this.addresses?.find((address) => address.id === el.value);
    if (address) {
      this.selectedAddressId = address.id;
      this.requestUpdate('selectedAddressId');
      this.dispatchEvent(
        new CustomEvent(SELECT_EVENT, {
          bubbles: true,
          composed: true,
          detail: { address },
        })
      );
    }
  }

  protected override render(): TemplateResult {
    if (!this.addresses?.length) {
      return html`<slot name="empty">
        <oryx-icon type="location" size="large"></oryx-icon>
        ${i18n('user.address.no-addresses')}
      </slot>`;
    }

    return html`
      ${keyed(
        this.createAddressesKey(),
        repeat(
          this.addresses,
          (address) => address.id,
          (address) => {
            const isSelected = this.isSelected(address);
            return html`<oryx-tile ?selected=${isSelected}>
              <oryx-address-list-item
                .addressId=${address.id}
                .options=${this.componentOptions}
              >
                ${when(
                  this.componentOptions.selectable,
                  () => html`<input
                    name="address"
                    type="radio"
                    value="${address.id as string}"
                    ?checked=${isSelected}
                    @change=${this.onChange}
                  />`
                )}
              </oryx-address-list-item>
            </oryx-tile>`;
          }
        )
      )}
    `;
  }

  protected createAddressesKey(): string | void {
    return this.addresses?.map(({ id }) => id).join('-');
  }

  protected isSelected(address: Address): boolean {
    if (!this.componentOptions.selectable) return false;

    if (
      !this.selectedAddressId ||
      !this.addresses?.find((a) => a.id == this.selectedAddressId)
    ) {
      if (this.isDefault(address) || this.isFirstInList(address.id)) {
        this.selectedAddressId = address.id;
      }
    }

    return this.selectedAddressId === address.id;
  }

  protected isDefault(address: Address): boolean {
    const isDefault =
      this.componentOptions.addressDefaults === AddressDefaults.All;
    const isDefaultBilling =
      isDefault ||
      this.componentOptions.addressDefaults === AddressDefaults.Billing;
    const isDefaultShipping =
      isDefault ||
      this.componentOptions.addressDefaults === AddressDefaults.Shipping;
    return (
      !!(isDefaultShipping && address.isDefaultShipping) ||
      !!(isDefaultBilling && address.isDefaultBilling)
    );
  }

  protected isFirstInList(addressId?: string): boolean {
    return this.addresses?.[0]?.id === addressId;
  }
}
