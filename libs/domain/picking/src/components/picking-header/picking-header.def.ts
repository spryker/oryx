import { componentDef } from '@spryker-oryx/core';

export const pickingHeaderComponent = componentDef({
  name: 'oryx-picking-header',
  impl: () =>
    import('./picking-header.component').then((m) => m.PickingHeaderComponent),
});
