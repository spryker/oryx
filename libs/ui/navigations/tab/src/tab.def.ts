import { componentDef } from '@spryker-oryx/core';

export const tabComponent = componentDef({
  name: 'oryx-tab',
  impl: () => import('./tab.component').then((m) => m.TabComponent),
});
