import { componentDef } from '@spryker-oryx/core';

export const addressModalComponent = componentDef({
  name: 'oryx-user-address-modal',
  impl: () =>
    import('./address-modal.component').then((m) => m.AddressModalComponent),
});
