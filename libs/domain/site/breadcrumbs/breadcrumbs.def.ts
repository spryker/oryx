import { componentDef } from '@spryker-oryx/utilities';

export const siteBreadcrumbsComponent = componentDef({
  name: 'oryx-site-breadcrumbs',
  impl: () =>
    import('./breadcrumbs.component').then((m) => m.SiteBreadcrumbsComponent),
  schema: import('./breadcrumbs.schema').then((m) => m.siteBreadcrumbsSchema),
});
