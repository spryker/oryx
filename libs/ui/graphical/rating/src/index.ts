import { componentDef } from '@spryker-oryx/core';

export * from './rating.component';
export * from './rating.model';
export * from './styles';

export const ratingComponent = componentDef({
  name: 'oryx-rating',
  impl: () => import('./rating.component').then((m) => m.RatingComponent),
});
