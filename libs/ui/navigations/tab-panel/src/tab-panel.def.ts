import { componentDef } from '@spryker-oryx/core';

export const tabPanelComponent = componentDef({
  name: 'oryx-tab-panel',
  impl: () => import('./tab-panel.component').then((m) => m.TabPanelComponent),
});
