import { componentDef } from '@spryker-oryx/utilities';

export const colorModeSelectorComponent = componentDef({
  name: 'oryx-color-mode-selector',
  impl: () =>
    import('./color-mode-selector.component').then(
      (m) => m.ColorModeSelectorComponent
    ),
});
