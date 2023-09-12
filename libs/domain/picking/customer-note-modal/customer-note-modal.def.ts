import { componentDef } from '@spryker-oryx/utilities';

export const customerNoteModalComponent = componentDef({
  name: 'oryx-picking-customer-note-modal',
  impl: () =>
    import('./customer-note-modal.component').then(
      (m) => m.CustomerNoteModalComponent
    ),
});
