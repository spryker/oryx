import { componentDef } from '@spryker-oryx/core';

export const accountSummaryComponent = componentDef({
  name: 'oryx-user-summary',
  impl: () => import('./summary.component').then((m) => m.UserSummaryComponent),
  schema: () =>
    import('./summary.schema').then((m) => m.userSummaryComponentSchema),
});
