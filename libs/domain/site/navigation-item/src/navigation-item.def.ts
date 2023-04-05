import { componentDef } from '@spryker-oryx/core';

export const siteNavigationItemComponent = componentDef({
  name: 'oryx-site-navigation-item',
  impl: () =>
    import('./navigation-item.component').then(
      (m) => m.SiteNavigationItemComponent
    ),
  schema: import('./navigation-item.schema').then(
    (m) => m.siteNavigationItemSchema
  ),
});
