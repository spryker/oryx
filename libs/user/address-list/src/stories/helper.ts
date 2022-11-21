import { resolve } from '@spryker-oryx/injector';
import { AddressService } from '@spryker-oryx/user';
import { MockAddressService, MockAddressType } from '@spryker-oryx/user/mocks';
import { html, TemplateResult } from 'lit';
import { AddressListOptions } from '../address-list.model';

export const renderSelector = (
  type: MockAddressType,
  options: AddressListOptions = { editable: false }
): TemplateResult => {
  const addressService = resolve(
    AddressService
  ) as unknown as MockAddressService;
  addressService.changeMockAddressType(type);
  return html`<oryx-address-list .options=${options}></oryx-address-list>`;
};
