import { componentDef } from '@spryker-oryx/utilities';

export const siteTimeComponent = componentDef({
  name: 'oryx-site-time',
  impl: () => import('./time.component').then((m) => m.SiteTimeComponent),
});
