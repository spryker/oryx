import { componentDef } from '@spryker-oryx/utilities';

export const siteNavigationComponent = componentDef({
  name: 'oryx-site-navigation',
  impl: () =>
    import('./navigation.component').then((m) => m.SiteNavigationComponent),
});
