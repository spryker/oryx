import { componentDef } from '@spryker-oryx/utilities';

export const merchantOpeningHoursComponent = componentDef({
  name: 'oryx-merchant-opening-hours',
  impl: () =>
    import('./opening-hours.component').then(
      (m) => m.MerchantOpeningHoursComponent
    ),
  schema: () =>
    import('./opening-hours.schema').then(
      (m) => m.merchantOpeningHoursComponentSchema
    ),
});
