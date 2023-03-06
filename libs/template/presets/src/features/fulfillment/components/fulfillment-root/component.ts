import { componentDef } from '@spryker-oryx/core';

export const fulfillmentRootComponent = componentDef({
  name: 'oryx-fulfillment-root',
  impl: () => import('./fulfillment-root.component').then((m) => m.default),
});
