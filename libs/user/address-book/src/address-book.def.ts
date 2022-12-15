import { componentDef } from '@spryker-oryx/core';

export const addressBookComponent = componentDef({
  name: 'oryx-user-address-book',
  impl: () =>
    import('./address-book.component').then((m) => m.AddressBookComponent),
});
