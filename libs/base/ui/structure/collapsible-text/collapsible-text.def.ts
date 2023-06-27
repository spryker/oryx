import { componentDef } from '@spryker-oryx/core';

export const collapsibleTextComponent = componentDef({
  name: 'oryx-collapsible-text',
  impl: () =>
    import('./collapsible-text.component').then(
      (m) => m.CollapsibleTextComponent
    ),
});
