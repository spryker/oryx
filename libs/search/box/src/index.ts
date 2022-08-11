import { componentDef } from '@spryker-oryx/core';

export * from './box.component';
export * from './box.model';
export * from './controllers';
export * from './styles';

export const searchBoxComponent = componentDef({
  name: 'search-box',
  impl: () => import('./box.component').then((m) => m.SearchBoxComponent),
});
