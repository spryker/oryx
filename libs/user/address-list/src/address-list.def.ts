import { componentDef } from '@spryker-oryx/core';

export const addressListComponent = componentDef({
  name: 'oryx-address-list',
  impl: () =>
    import('./address-list.component').then((m) => m.AddressListComponent),
});
