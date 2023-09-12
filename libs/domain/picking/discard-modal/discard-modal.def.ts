import { componentDef } from '@spryker-oryx/utilities';

export const discardModalComponent = componentDef({
  name: 'oryx-picking-discard-modal',
  impl: () =>
    import('./discard-modal.component').then((m) => m.DiscardModalComponent),
});
