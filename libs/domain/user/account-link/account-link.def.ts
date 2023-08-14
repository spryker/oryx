import { componentDef } from '@spryker-oryx/utilities';

export const accountLinkComponent = componentDef({
  name: 'oryx-user-account-link',
  impl: () =>
    import('./account-link.component').then((m) => m.AccountLinkComponent),
});
