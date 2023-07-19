import { componentDef } from '@spryker-oryx/utilities';

export const inputListComponent = componentDef({
  name: 'oryx-input-list',
  impl: () =>
    import('./input-list.component').then((m) => m.InputListComponent),
  stylesheets: [
    {
      rules: () => import('./input-list.styles').then((m) => m.screenStyles),
    },
  ],
});
