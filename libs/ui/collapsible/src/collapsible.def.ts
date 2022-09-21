import { componentDef } from '@spryker-oryx/core';

export const collapsibleComponent = componentDef({
  name: 'oryx-collapsible',
  impl: () =>
    import('./collapsible.component').then((m) => m.CollapsibleComponent),
});
