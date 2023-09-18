import { componentDef } from '@spryker-oryx/utilities';

export const siteMenuItemComponent = componentDef({
  name: 'oryx-site-menu-item',
  impl: () =>
    import('./menu-item.component').then((m) => m.SiteMenuItemComponent),
});
