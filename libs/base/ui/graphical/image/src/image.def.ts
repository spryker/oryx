import { componentDef } from '@spryker-oryx/utilities';

export const imageComponent = componentDef({
  name: 'oryx-image',
  impl: () => import('./image.component').then((m) => m.ImageComponent),
});
