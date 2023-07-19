import { componentDef } from '@spryker-oryx/utilities';

export const linkComponent = componentDef({
  name: 'oryx-link',
  impl: () => import('./link.component').then((m) => m.LinkComponent),
  stylesheets: [
    {
      theme: 'backoffice',
      rules: () =>
        import('./styles/backoffice.styles').then(
          (m) => m.backOfficeLinkStyles
        ),
    },
    {
      theme: 'storefront',
      rules: () =>
        import('./styles/storefront.styles').then(
          (m) => m.storefrontLinkStyles
        ),
    },
  ],
});
