import { componentDef } from '@spryker-oryx/core';

export const modeSelectorComponent = componentDef({
  name: 'oryx-mode-selector',
  impl: () =>
    import('./mode-selector.component').then((m) => m.ModeSelectorComponent),
  schema: () =>
    import('./mode-selector.schema').then((m) => m.modeSelectorComponentSchema),
});
