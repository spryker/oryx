import { componentDef } from '@spryker-oryx/core';
import { AddressListItemOptions } from './address-list-item.model';

declare global {
  interface FeatureOptions {
    'oryx-address-list-item'?: AddressListItemOptions;
  }
}

export const addressListItemComponent = componentDef({
  name: 'oryx-address-list-item',
  impl: () =>
    import('./address-list-item.component').then(
      (m) => m.AddressListItemComponent
    ),
});
