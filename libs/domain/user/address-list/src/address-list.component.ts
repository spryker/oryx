import { resolve } from '@spryker-oryx/di';
import { ContentMixin, defaultOptions } from '@spryker-oryx/experience';
import { Size } from '@spryker-oryx/ui';
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
import { state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { when } from 'lit/directives/when.js';
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

  protected willUpdate(changedProperties: PropertyValues): void {
    if (
      this.componentOptions?.selectable &&
      !this.addresses?.find((address) => address.id === this.selectedAddressId)
    ) {
      this.selectedAddressId =
        this.addresses?.find((a) => this.isDefault(a))?.id ??
        this.addresses?.[0].id;
      this.dispatchSelectedAddress(this.selectedAddressId);
    }

    super.willUpdate(changedProperties);
  }

  protected override render(): TemplateResult | void {
    if (!this.addresses?.length) {
      return this.renderEmpty();
    }

    return html`
      ${repeat(
        this.addresses,
        (address) => this.createKey(address.id),
        (address) => this.renderAddress(address)
      )}
    `;
  }

  protected renderAddress(address: Address): TemplateResult | void {
    return html`<oryx-tile ?selected=${this.selectedAddressId === address.id}>
      <oryx-address-list-item
        .addressId=${address.id}
        .options=${this.componentOptions}
      >
        ${when(
          this.componentOptions?.selectable,
          () => html`<input
            name="address"
            type="radio"
            value="${address.id as string}"
            ?checked=${this.selectedAddressId === address.id}
            @input=${this.onInput}
          />`
        )}
      </oryx-address-list-item>
    </oryx-tile>`;
  }

  protected renderEmpty(): TemplateResult | void {
    return html`<slot name="empty">
      <oryx-icon type="location" size=${Size.Lg}></oryx-icon>
      ${i18n('user.address.no-addresses')}
    </slot>`;
  }

  protected onInput(ev: Event): void {
    const el = ev.target as HTMLInputElement;
    this.dispatchSelectedAddress(el.value);
  }

  protected dispatchSelectedAddress(addressId?: string): void {
    const address = this.addresses?.find((address) => address.id === addressId);
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

  protected createKey(addressId?: string): string {
    return `${addressId}-${this.addresses?.findIndex(
      (a) => a.id === addressId
    )}-${this.addresses?.length}`;
  }
}
