import { componentDef } from '@spryker-oryx/utilities';

export const tileComponent = componentDef({
  name: 'oryx-tile',
  impl: () => import('./tile.component').then((m) => m.TileComponent),
});
