import { componentDef } from '@spryker-oryx/core';

export const ratingComponent = componentDef({
  name: 'oryx-rating',
  impl: () => import('./rating.component').then((m) => m.RatingComponent),
});
