import { UserAddressListItemOptions } from '@spryker-oryx/user/address-list-item';
import { componentDef } from '@spryker-oryx/utilities';

declare global {
  interface FeatureOptions {
    'oryx-user-address-list'?: UserAddressListItemOptions;
  }
}

export const userAddressListComponent = componentDef({
  name: 'oryx-user-address-list',
  impl: () =>
    import('./address-list.component').then((m) => m.UserAddressListComponent),
  schema: () =>
    import('./address-list.schema').then((m) => m.userAddressListSchema),
});
