import { componentDef } from '@spryker-oryx/core';

export const customerNoteComponent = componentDef({
  name: 'oryx-customer-note',
  impl: () =>
    import('./customer-note.component').then((m) => m.CustomerNoteComponent),
});
