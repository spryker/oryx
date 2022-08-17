import { componentDef } from '@spryker-oryx/core';

export const searchboxComponent = componentDef({
  name: 'oryx-search',
  impl: () => import('./searchbox.component').then((m) => m.SearchboxComponent),
});
