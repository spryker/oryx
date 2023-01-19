import { componentDef } from '@spryker-oryx/core';
import { AddressOptions } from './address.model';

declare global {
  interface Flags {
    'oryx-user-address'?: AddressOptions;
  }
}

export const addressComponent = componentDef({
  name: 'oryx-user-address',
  impl: () => import('./address.component').then((m) => m.AddressComponent),
});
