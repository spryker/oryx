import { Address } from '@spryker-oryx/checkout';
import { resolve } from '@spryker-oryx/di';
import { ContentMixin } from '@spryker-oryx/experience';
import { AddressService } from '@spryker-oryx/user';
import { AddressFormComponent } from '@spryker-oryx/user/address-form';
import { AddressDefaults } from '@spryker-oryx/user/address-list-item';
import { signal, signalAware } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { query } from 'lit/decorators.js';
import { Observable, of } from 'rxjs';

@signalAware()
export class CheckoutAddressComponent extends ContentMixin(LitElement) {
  protected addressService = resolve(AddressService);

  protected selected: Address | null = null;
  protected addresses = signal(this.addressService.getAddresses());

  @query('oryx-address-form')
  protected addressComponent?: AddressFormComponent;

  collect(): Observable<Address | null> {
    const form = this.addressComponent?.getForm();
    if (!form?.checkValidity() && !this.selected) {
      form?.reportValidity();
      return of(null);
    }
    return of(
      form
        ? (Object.fromEntries(
            new FormData(form).entries()
          ) as unknown as Address)
        : (this.selected as Address | null)
    );
  }

  protected override render(): TemplateResult | void {
    if (!this.addresses()?.length)
      return html` <oryx-address-form></oryx-address-form> `;

    return html` <oryx-address-list
      .options=${{ selectable: true, addressDefaults: AddressDefaults.All }}
      @oryx.select=${this.onSelect}
    ></oryx-address-list>`;
  }

  protected onSelect(e: CustomEvent): void {
    this.selected = e.detail.address;
  }
}
