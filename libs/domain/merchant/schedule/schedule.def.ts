import { componentDef } from '@spryker-oryx/utilities';

export const merchantScheduleComponent = componentDef({
  name: 'oryx-merchant-schedule',
  impl: () =>
    import('./schedule.component').then((m) => m.MerchantScheduleComponent),
  schema: () =>
    import('./schedule.schema').then((m) => m.merchantScheduleComponentSchema),
});
