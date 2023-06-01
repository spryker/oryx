import { componentDef } from '@spryker-oryx/core';
import { AddressListItemOptions } from '@spryker-oryx/user/address-list-item';

declare global {
  interface FeatureOptions {
    'oryx-user-address-list'?: AddressListItemOptions;
  }
}

export const addressListComponent = componentDef({
  name: 'oryx-user-address-list',
  impl: () =>
    import('./address-list.component').then((m) => m.UserAddressListComponent),
});
