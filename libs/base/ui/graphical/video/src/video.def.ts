import { componentDef } from '@spryker-oryx/core';

export const videoComponent = componentDef({
  name: 'oryx-video',
  impl: () => import('./video.component').then((m) => m.default),
});
