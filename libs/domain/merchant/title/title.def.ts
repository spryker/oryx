import { componentDef } from '@spryker-oryx/utilities';

export const merchantTitleComponent = componentDef({
  name: 'oryx-merchant-title',
  impl: () => import('./title.component').then((m) => m.MerchantTitleComponent),
  schema: () => import('./title.schema').then((m) => m.merchantTitleSchema),
});
