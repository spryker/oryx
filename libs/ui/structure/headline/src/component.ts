import { componentDef } from '@spryker-oryx/core';

export const headlineComponent = componentDef({
  name: 'oryx-headline',
  impl: () => import('./headline.component').then((m) => m.HeadlineComponent),
});
