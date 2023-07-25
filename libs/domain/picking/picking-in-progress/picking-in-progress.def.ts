import { componentDef } from '@spryker-oryx/utilities';

export const pickingInProgressModalComponent = componentDef({
  name: 'oryx-picking-in-progress-modal',
  impl: () =>
    import('./picking-in-progress.component').then(
      (m) => m.PickingInProgressModalComponent
    ),
});
