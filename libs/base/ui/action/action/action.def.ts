import { componentDef } from '@spryker-oryx/utilities';

export const actionComponent = componentDef({
  name: 'oryx-action',
  impl: () => import('./action.component').then((m) => m.ActionComponent),
  stylesheets: [
    {
      rules: () => import('./action.styles').then((m) => m.screenStyles),
    },
  ],
});
