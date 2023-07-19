import { componentDef } from '@spryker-oryx/utilities';

export const selectComponent = componentDef({
  name: 'oryx-select',
  impl: () => import('./select.component').then((m) => m.SelectComponent),
  stylesheets: [
    {
      rules: () => import('./styles').then((m) => m.screenStyles),
    },
  ],
});
