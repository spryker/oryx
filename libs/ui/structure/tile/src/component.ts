import { componentDef } from '@spryker-oryx/core';

export const tileComponent = componentDef({
  name: 'oryx-tile',
  impl: () => import('./tile.component').then((m) => m.TileComponent),
});
