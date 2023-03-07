import { componentDef } from '@spryker-oryx/core';

export const colorModeSelectorComponent = componentDef({
  name: 'oryx-color-mode-selector',
  impl: () =>
    import('./color-mode-selector.component').then(
      (m) => m.ColorModeSelectorComponent
    ),
  schema: () =>
    import('./color-mode-selector.schema').then(
      (m) => m.colorModeSelectorSchema
    ),
});
