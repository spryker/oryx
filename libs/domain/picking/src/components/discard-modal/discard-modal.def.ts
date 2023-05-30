import { componentDef } from '@spryker-oryx/core';

export const discardModalComponent = componentDef({
  name: 'oryx-discard-modal',
  impl: () =>
    import('./discard-modal.component').then((m) => m.DiscardModalComponent),
});
