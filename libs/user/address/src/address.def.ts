import { componentDef } from '@spryker-oryx/core';

export const addressComponent = componentDef({
  name: 'oryx-user-address',
  impl: () => import('./address.component').then((m) => m.AddressComponent),
});
