import { componentDef } from '@spryker-oryx/core';

export * from './toggle-icon.component';
export * from './toggle-icon.styles';

export const toggleIconComponent = componentDef({
  name: 'oryx-toggle-icon',
  impl: () =>
    import('./toggle-icon.component').then((m) => m.ToggleIconComponent),
});
