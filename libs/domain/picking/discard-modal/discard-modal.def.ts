import { componentDef } from '@spryker-oryx/utilities';

export const discardModalComponent = componentDef({
  name: 'oryx-discard-picking',
  impl: () =>
    import('./discard-modal.component').then((m) => m.DiscardPickingComponent),
});
