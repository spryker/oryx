import { componentDef } from '@spryker-oryx/utilities';

export const pickingCustomerNoteComponent = componentDef({
  name: 'oryx-picking-customer-note',
  impl: () =>
    import('./customer-note.component').then(
      (m) => m.PickingCustomerNoteComponent
    ),
});
