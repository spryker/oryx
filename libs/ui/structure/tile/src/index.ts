import { componentDef } from '@spryker-oryx/core';

export * from './tile.component';
export * from './tile.styles';

export const tileComponent = componentDef({
  name: 'oryx-tile',
  impl: () => import('./tile.component').then((m) => m.TileComponent),
});
