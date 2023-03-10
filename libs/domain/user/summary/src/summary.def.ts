import { componentDef } from '@spryker-oryx/core';
export { accountSummaryTriggerComponent } from './components/trigger/trigger.def';

export const accountSummaryComponent = componentDef({
  name: 'oryx-user-summary',
  impl: () => import('./summary.component').then((m) => m.UserSummaryComponent),
  schema: () =>
    import('./summary.schema').then((m) => m.userSummaryComponentSchema),
});
