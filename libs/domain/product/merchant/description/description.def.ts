import { componentDef } from '@spryker-oryx/utilities';

export const merchantDescriptionComponent = componentDef({
  name: 'oryx-merchant-description',
  impl: () =>
    import('./description.component').then(
      (m) => m.MerchantDescriptionComponent
    ),
  schema: () =>
    import('./description.schema').then((m) => m.merchantDescriptionSchema),
});
