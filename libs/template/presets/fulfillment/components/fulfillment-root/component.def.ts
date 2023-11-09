import { componentDef } from '@spryker-oryx/utilities';

export const fulfillmentRootComponent = componentDef({
  name: 'oryx-fulfillment-root',
  impl: () => import('./fulfillment-root.component').then((m) => m.default),
});
