import { Address, isValid } from '@spryker-oryx/checkout';
import { resolve } from '@spryker-oryx/di';
import { ContentMixin } from '@spryker-oryx/experience';
import { AddressService } from '@spryker-oryx/user';
import { AddressFormComponent } from '@spryker-oryx/user/address-form';
import { AddressDefaults } from '@spryker-oryx/user/address-list-item';
import { signal, signalAware } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { property, query, state } from 'lit/decorators.js';

@signalAware()
export class CheckoutAddressComponent
  extends ContentMixin(LitElement)
  implements isValid
{
  @property({ type: Object }) address?: Address;

  protected addressService = resolve(AddressService);
  protected addresses = signal(this.addressService.getAddresses());

  @state()
  protected selected: Address | null = null;

  @query('oryx-address-form')
  protected addressComponent?: AddressFormComponent;

  protected override render(): TemplateResult | void {
    if (this.addresses()?.length)
      return html`<oryx-address-user-list
        .options=${{ selectable: true, addressDefaults: AddressDefaults.All }}
        @oryx.select=${this.onSelect}
      ></oryx-address-user-list>`;

    return html`<oryx-address-form
      .address=${this.address}
    ></oryx-address-form>`;
  }

  protected onSelect(e: CustomEvent): void {
    this.selected = e.detail.address;
    this.dispatchEvent(
      new CustomEvent('selectedAddress', {
        detail: { data: this.selected, valid: true },
        bubbles: true,
        composed: true,
      })
    );
  }

  isValid(report: boolean): boolean {
    if (this.selected) {
      return true;
    }

    const form = this.addressComponent?.getForm();
    if (!form?.checkValidity() && report) {
      form?.reportValidity();
    }
    return !!form?.checkValidity();
  }
}
