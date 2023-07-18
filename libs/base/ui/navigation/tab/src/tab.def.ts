import { componentDef } from '@spryker-oryx/utilities';

export const tabComponent = componentDef({
  name: 'oryx-tab',
  impl: () => import('./tab.component').then((m) => m.TabComponent),
  stylesheets: [
    {
      rules: () => import('./tab.styles').then((m) => m.screenStyles),
    },
  ],
});
