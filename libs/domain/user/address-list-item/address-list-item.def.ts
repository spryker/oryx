import { componentDef } from '@spryker-oryx/core';
import { UserAddressListItemOptions } from './address-list-item.model';

declare global {
  interface FeatureOptions {
    'oryx-user-address-list-item'?: UserAddressListItemOptions;
  }
}

export const userAddressListItemComponent = componentDef({
  name: 'oryx-user-address-list-item',
  impl: () =>
    import('./address-list-item.component').then(
      (m) => m.UserAddressListItemComponent
    ),
});
