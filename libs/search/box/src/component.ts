import { componentDef } from '@spryker-oryx/core';

export const searchBoxComponent = componentDef({
  name: 'search-box',
  impl: () => import('./box.component').then((m) => m.SearchBoxComponent),
});
