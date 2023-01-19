import { componentDef } from '@spryker-oryx/core';
import { AddressListItemOptions } from '@spryker-oryx/user/address-list-item';

declare global {
  interface FeatureOptions {
    'oryx-address-list'?: AddressListItemOptions;
  }
}

export const addressListComponent = componentDef({
  name: 'oryx-address-list',
  impl: () =>
    import('./address-list.component').then((m) => m.AddressListComponent),
});
