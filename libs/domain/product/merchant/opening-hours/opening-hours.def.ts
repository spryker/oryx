import { componentDef } from '@spryker-oryx/utilities';

export const merchantOpeningsHoursComponent = componentDef({
  name: 'oryx-merchant-openings-hours',
  impl: () =>
    import('./opening-hours.component').then(
      (m) => m.MerchantOpeningsHoursComponent
    ),
});
