import { componentDef } from '@spryker-oryx/core';

export const addressListItemComponent = componentDef({
  name: 'oryx-address-list-item',
  impl: () =>
    import('./address-list-item.component').then(
      (m) => m.AddressListItemComponent
    ),
});
