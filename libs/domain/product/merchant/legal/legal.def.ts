import { componentDef } from '@spryker-oryx/utilities';

export const merchantLegalComponent = componentDef({
  name: 'oryx-merchant-legal',
  impl: () => import('./legal.component').then((m) => m.MerchantLegalComponent),
});
