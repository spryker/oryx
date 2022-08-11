import { componentDef } from '@spryker-oryx/core';

export * from './card.component';
export * from './card.model';

export const cardComponent = componentDef({
  name: 'oryx-card',
  impl: () => import('./card.component').then((m) => m.CardComponent),
});
