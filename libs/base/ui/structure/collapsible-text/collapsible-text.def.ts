import { componentDef } from '@spryker-oryx/utilities';

export const collapsibleTextComponent = componentDef({
  name: 'oryx-collapsible-text',
  impl: () =>
    import('./collapsible-text.component').then(
      (m) => m.CollapsibleTextComponent
    ),
});
