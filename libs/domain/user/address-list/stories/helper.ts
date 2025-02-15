import { resolve } from '@spryker-oryx/di';
import { AddressService } from '@spryker-oryx/user';
import {
  AddressDefaults,
  UserAddressListItemOptions,
} from '@spryker-oryx/user/address-list-item';
import { MockAddressService, MockAddressType } from '@spryker-oryx/user/mocks';
import { TemplateResult, html } from 'lit';

export const renderSelector = (
  type: MockAddressType,
  props: UserAddressListItemOptions = {}
): TemplateResult => {
  const addressService = resolve(
    AddressService
  ) as unknown as MockAddressService;
  addressService.changeMockAddressType(type);
  return html`<oryx-user-address-list
    .options=${{
      addressDefaults: AddressDefaults.All,
      selectable: false,
      editable: true,
      removable: true,
      ...props,
    }}
    @oryx.edit=${console.log}
    @oryx.remove=${console.log}
  ></oryx-user-address-list>`;
};
