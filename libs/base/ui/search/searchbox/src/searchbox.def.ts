import { componentDef } from '@spryker-oryx/utilities';

export const searchboxComponent = componentDef({
  name: 'oryx-search',
  impl: () => import('./searchbox.component').then((m) => m.SearchboxComponent),
  stylesheets: [
    {
      rules: () => import('./searchbox.styles').then((m) => m.screenStyles),
    },
  ],
});
