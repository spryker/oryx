import { componentDef } from '@spryker-oryx/utilities';

export const ratingComponent = componentDef({
  name: 'oryx-rating',
  impl: () => import('./rating.component').then((m) => m.RatingComponent),
});
