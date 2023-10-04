import { componentDef } from '@spryker-oryx/utilities';

export const pickingDiscardModalComponent = componentDef({
  name: 'oryx-picking-discard-modal',
  impl: () =>
    import('./discard-modal.component').then(
      (m) => m.PickingDiscardModalComponent
    ),
});
