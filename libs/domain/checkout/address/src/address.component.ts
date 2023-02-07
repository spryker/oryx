import {
  Address,
  CheckoutDataService,
  CheckoutForm,
} from '@spryker-oryx/checkout';
import { resolve } from '@spryker-oryx/di';
import { ContentMixin } from '@spryker-oryx/experience';
import { AddressService } from '@spryker-oryx/user';
import { AddressFormComponent } from '@spryker-oryx/user/address-form';
import { AddressDefaults } from '@spryker-oryx/user/address-list-item';
import { asyncValue } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { createRef, ref } from 'lit/directives/ref.js';

export class CheckoutAddressComponent
  extends ContentMixin(LitElement)
  implements CheckoutForm
{
  protected checkoutDataService = resolve(CheckoutDataService);
  protected addressService = resolve(AddressService);

  protected selectedAddress: Address | null = null;

  protected addresses$ = this.addressService.getAddresses();

  protected formRef = createRef<AddressFormComponent>();

  protected getFormElement(): HTMLFormElement | null | undefined {
    return this.formRef.value?.getForm();
  }

  submit(report = false): boolean {
    const form = this.getFormElement();

    if (!form?.checkValidity() && !this.selectedAddress) {
      if (report) {
        form?.reportValidity();
      }

      this.checkoutDataService.setAddress(null);

      return false;
    }

    const data = form
      ? Object.fromEntries(new FormData(form).entries())
      : this.selectedAddress;

    this.checkoutDataService.setAddress(data as unknown as Address);

    return true;
  }

  protected handleAddressFromList(e: CustomEvent): void {
    this.selectedAddress = e.detail.address;
  }

  protected override render(): TemplateResult {
    return html`${asyncValue(this.addresses$, (addresses) => {
      if (!addresses?.length) {
        return html`
          <oryx-address-form ${ref(this.formRef)}></oryx-address-form>
        `;
      }

      return html`
        <oryx-address-list
          .options=${{ selectable: true, addressDefaults: AddressDefaults.All }}
          @oryx.select=${(e: CustomEvent): void =>
            this.handleAddressFromList(e)}
        ></oryx-address-list>
      `;
    })}`;
  }
}
