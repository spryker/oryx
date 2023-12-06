import { componentDef } from '@spryker-oryx/utilities';

export const siteBreadcrumbComponent = componentDef({
  name: 'oryx-site-breadcrumb',
  impl: () =>
    import('./breadcrumb.component').then((m) => m.SiteBreadcrumbComponent),
  schema: import('./breadcrumb.schema').then((m) => m.siteBreadcrumbSchema),
  stylesheets: [
    {
      rules: () => import('./breadcrumb.styles').then((m) => m.screenStyles),
    },
  ],
});
