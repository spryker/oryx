import { componentDef } from '@spryker-oryx/core';

export const accountSummaryTriggerComponent = componentDef({
  name: 'oryx-user-summary-trigger',
  impl: () => import('./trigger.component').then((m) => m.UserSummaryTriggerComponent),
});
