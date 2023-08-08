import { componentDef } from '@spryker-oryx/utilities';

export const breadcrumbsComponent = componentDef({
  name: 'oryx-breadcrumbs',
  impl: () =>
    import('./breadcrumbs.component').then((m) => m.BreadcrumbsComponent),
  stylesheets: [
    {
      rules: () => import('./breadcrumbs.styles').then((m) => m.screenStyles),
    },
  ],
});
