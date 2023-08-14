import { componentDef } from '@spryker-oryx/utilities';

export const accountMenuComponent = componentDef({
  name: 'oryx-user-account-menu',
  impl: () =>
    import('./account-menu.component').then((m) => m.AccountMenuComponent),
});
