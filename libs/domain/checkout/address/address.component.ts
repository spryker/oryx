import { Address } from '@spryker-oryx/checkout';
import { resolve } from '@spryker-oryx/di';
import { ContentMixin } from '@spryker-oryx/experience';
import { AddressService } from '@spryker-oryx/user';
import { AddressFormComponent } from '@spryker-oryx/user/address-form';
import { AddressDefaults } from '@spryker-oryx/user/address-list-item';
import { signal, signalAware } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { query, state } from 'lit/decorators.js';

@signalAware()
export class CheckoutAddressComponent extends ContentMixin(LitElement) {
  protected addressService = resolve(AddressService);

  protected addresses = signal(this.addressService.getAddresses());

  @state()
  protected selected: Address | null = null;

  @query('oryx-address-form')
  protected addressComponent?: AddressFormComponent;

  collectData(): Address | null {
    const form = this.addressComponent?.getForm();
    if (!this.selected && !form?.checkValidity()) {
      form?.reportValidity();
      return null;
    }
    return form
      ? (Object.fromEntries(new FormData(form).entries()) as unknown as Address)
      : this.selected;
  }

  protected override render(): TemplateResult | void {
    if (this.addresses()?.length)
      return html`<oryx-address-list
        .options=${{ selectable: true, addressDefaults: AddressDefaults.All }}
        @oryx.select=${this.onSelect}
      ></oryx-address-list>`;

    return html`<oryx-address-form></oryx-address-form>`;
  }

  protected onSelect(e: CustomEvent): void {
    this.selected = e.detail.address;
  }
}
