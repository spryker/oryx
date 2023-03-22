import { componentDef } from '@spryker-oryx/core';

export const navigateBackComponent = componentDef({
  name: 'oryx-navigate-back',
  impl: () =>
    import('./navigate-back.component').then((m) => m.NavigateBackComponent),
});
