import { componentDef } from '@spryker-oryx/core';

export * from './image.component';
export * from './image.styles';

export const imageComponent = componentDef({
  name: 'oryx-image',
  impl: () => import('./image.component').then((m) => m.ImageComponent),
});
