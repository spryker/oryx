import { componentDef } from '@spryker-oryx/utilities';

export const pickingCustomerNoteModalComponent = componentDef({
  name: 'oryx-picking-customer-note-modal',
  impl: () =>
    import('./customer-note-modal.component').then(
      (m) => m.PickingCustomerNoteModalComponent
    ),
});
