import { componentDef } from '@spryker-oryx/utilities';

export const customerNoteComponent = componentDef({
  name: 'oryx-picking-customer-note',
  impl: () =>
    import('./customer-note.component').then((m) => m.CustomerNoteComponent),
});
