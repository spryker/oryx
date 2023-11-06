import { isValid } from '@spryker-oryx/checkout';
import { ContentMixin } from '@spryker-oryx/experience';
import {
  AddressEventDetail,
  AddressMixin,
  CrudState,
} from '@spryker-oryx/user';
import { UserAddressFormComponent } from '@spryker-oryx/user/address-form';
import { AddressDefaults } from '@spryker-oryx/user/address-list-item';
import { signalAware } from '@spryker-oryx/utilities';
import { LitElement, TemplateResult, html } from 'lit';
import { query } from 'lit/decorators.js';
import { CheckoutAddressOptions } from './address.model';

@signalAware()
export class CheckoutAddressComponent
  extends AddressMixin(ContentMixin<CheckoutAddressOptions>(LitElement))
  implements isValid
{
  @query('oryx-user-address-form')
  protected addressComponent?: UserAddressFormComponent;

  protected override render(): TemplateResult | void {
    if (this.$addresses()?.length) {
      if (this.$options().enableList) {
        return html`<oryx-user-address-list
          .addressId=${this.$addressId()}
          .options=${{ selectable: true, addressDefaults: AddressDefaults.All }}
          @change=${this.onChange}
        ></oryx-user-address-list>`;
      } else {
        return html`<oryx-user-address
          .addressId=${this.$addressId()}
          .options=${{ multiline: true }}
        ></oryx-user-address>`;
      }
    }

    return html`<oryx-user-address-form
      .address=${this.address}
    ></oryx-user-address-form>`;
  }

  protected onChange(e: CustomEvent<AddressEventDetail>): void {
    this.addressStateService.set(CrudState.Read, e.detail.address?.id);
  }

  isValid(report: boolean): boolean {
    if (this.$addressId()) {
      return true;
    }

    const form = this.addressComponent?.getForm();
    if (!form?.checkValidity() && report) {
      form?.reportValidity();
    }

    return !!form?.checkValidity();
  }
}
