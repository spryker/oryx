import { resolve } from '@spryker-oryx/injector';
import { AddressService } from '@spryker-oryx/user';
import { AddressListItemOptions } from '@spryker-oryx/user/address-list-item';
import { MockAddressService, MockAddressType } from '@spryker-oryx/user/mocks';
import { html, TemplateResult } from 'lit';

export const renderSelector = (
  type: MockAddressType,
  props: AddressListItemOptions = {}
): TemplateResult => {
  const addressService = resolve(
    AddressService
  ) as unknown as MockAddressService;
  addressService.changeMockAddressType(type);
  return html`<oryx-address-list
    .options=${{
      defaultShipping: true,
      defaultBilling: true,
      selectable: false,
      editable: true,
      removable: true,
      ...props,
    }}
    @oryx.select=${console.log}
    @oryx.edit=${console.log}
    @oryx.remove=${console.log}
  ></oryx-address-list>`;
};
