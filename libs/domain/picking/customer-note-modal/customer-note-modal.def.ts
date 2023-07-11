import { componentDef } from '@spryker-oryx/core';

export const customerNoteModalComponent = componentDef({
  name: 'oryx-customer-note-modal',
  impl: () =>
    import('./customer-note-modal.component').then(
      (m) => m.CustomerNoteModalComponent
    ),
});
