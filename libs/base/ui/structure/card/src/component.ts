import { componentDef } from '@spryker-oryx/utilities';

export const cardComponent = componentDef({
  name: 'oryx-card',
  impl: () => import('./card.component').then((m) => m.CardComponent),
});
