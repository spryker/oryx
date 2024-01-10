import { componentDef } from '@spryker-oryx/utilities';

export const siteJsonLdComponent = componentDef({
  name: 'oryx-site-jsonld',
  impl: () => import('./jsonld.component').then((m) => m.SiteJsonLdComponent),
});
