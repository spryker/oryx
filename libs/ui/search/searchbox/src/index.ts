import { componentDef } from '@spryker-oryx/core';

export * from './searchbox.component';
export * from './searchbox.controller';
export * from './searchbox.model';
export * from './searchbox.styles';

export const searchboxComponent = componentDef({
  name: 'oryx-search',
  impl: () => import('./searchbox.component').then((m) => m.SearchboxComponent),
});
