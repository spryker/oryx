import { componentDef } from '@spryker-oryx/utilities';
import { AddressOptions } from './address.model';

declare global {
  interface FeatureOptions {
    'oryx-user-address'?: AddressOptions;
  }
}

export const addressComponent = componentDef({
  name: 'oryx-user-address',
  impl: () => import('./address.component').then((m) => m.UserAddressComponent),
});
