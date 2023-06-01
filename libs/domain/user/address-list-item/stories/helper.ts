import { resolve } from '@spryker-oryx/di';
import { AddressService } from '@spryker-oryx/user';
import { MockAddressService, MockAddressType } from '@spryker-oryx/user/mocks';
import { html, TemplateResult } from 'lit';
import { when } from 'lit/directives/when.js';
import { AddressListItemOptions } from '../address-list-item.model';

export const renderSelector = (
  options: AddressListItemOptions = {}
): TemplateResult => {
  const addressService = resolve(
    AddressService
  ) as unknown as MockAddressService;
  addressService.changeMockAddressType(MockAddressType.OneWithDefaults);
  return html`<oryx-address-user-list-item
    addressId="currentaddressid"
    .options=${options}
  >
    ${when(
      options.selectable,
      () => html`<input type="radio" value="currentaddressid" />`
    )}
  </oryx-address-user-list-item>`;
};
