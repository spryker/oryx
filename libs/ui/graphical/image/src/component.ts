import { componentDef } from '@spryker-oryx/core';

export const imageComponent = componentDef({
  name: 'oryx-image',
  impl: () => import('./image.component').then((m) => m.ImageComponent),
});
