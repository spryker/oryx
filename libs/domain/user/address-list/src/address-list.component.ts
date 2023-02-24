import { resolve } from '@spryker-oryx/di';
import { ContentMixin, defaultOptions } from '@spryker-oryx/experience';
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
import { html, LitElement, PropertyValues, TemplateResult } from 'lit';
import { when } from 'lit-html/directives/when.js';
import { state } from 'lit/decorators.js';
import { keyed } from 'lit/directives/keyed.js';
import { repeat } from 'lit/directives/repeat.js';
import { SELECT_EVENT } from './address-list.model';
import { styles } from './address-list.styles';

@defaultOptions({ addressDefaults: AddressDefaults.All })
@hydratable('window:load')
export class AddressListComponent extends ContentMixin<AddressListItemOptions>(
  LitElement
) {
  static styles = styles;

  @asyncState()
  protected addresses = valueType(resolve(AddressService).getAddresses());

  @state()
  protected selectedAddressId?: string;

  protected update(changedProperties: PropertyValues): void {
    this.select();
    super.update(changedProperties);
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
            return html`<oryx-tile
              ?selected=${this.selectedAddressId === address.id}
            >
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
                    ?checked=${this.selectedAddressId === address.id}
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

  protected select(): void {
    const hasSelectedAddress = this.addresses?.find(
      (address) => address.id === this.selectedAddressId
    );
    if (!hasSelectedAddress) {
      this.selectedAddressId =
        this.addresses?.find((a) => this.isDefault(a))?.id ??
        this.addresses?.[0].id;
    }
  }

  protected onChange(ev: Event): void {
    const el = ev.target as HTMLInputElement;

    const address = this.addresses?.find((address) => address.id === el.value);
    if (address) {
      this.selectedAddressId = address.id;
      this.dispatchEvent(
        new CustomEvent(SELECT_EVENT, {
          bubbles: true,
          composed: true,
          detail: { address },
        })
      );
    }
  }

  /**
   * Indicates whether the given address is the default address. This is influenced by the
   * address data in combination with the address default mode:
   * - All
   * - Billing
   * - Shipping (aka delivery)
   *
   * If the address is a defaultBilling address and teh default mode is `All` or `Billing`,
   * this method will return true. Similarly, when the address is marked as `isDefaultShipping`
   * and the mode is `All` or `Shipping`.
   */
  protected isDefault(address: Address): boolean {
    const isDefault =
      this.componentOptions?.addressDefaults === AddressDefaults.All;
    const isDefaultBilling =
      isDefault ||
      this.componentOptions?.addressDefaults === AddressDefaults.Billing;
    const isDefaultShipping =
      isDefault ||
      this.componentOptions?.addressDefaults === AddressDefaults.Shipping;
    return (
      !!(isDefaultShipping && address.isDefaultShipping) ||
      !!(isDefaultBilling && address.isDefaultBilling)
    );
  }

  protected createAddressesKey(): string | void {
    return this.addresses?.map(({ id }) => id).join('-');
  }
}
