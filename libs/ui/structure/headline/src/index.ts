import { componentDef } from '@spryker-oryx/core';

export * from './headline.component';
export * from './headline.styles';

export const headlineComponent = componentDef({
  name: 'oryx-headline',
  impl: () => import('./headline.component').then((m) => m.HeadlineComponent),
});
