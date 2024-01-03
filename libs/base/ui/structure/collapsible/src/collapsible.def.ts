import { componentDef, featureVersion } from '@spryker-oryx/utilities';

export const collapsibleComponent = componentDef({
  name: 'oryx-collapsible',
  impl: () =>
    import('./collapsible.component').then((m) => m.CollapsibleComponent),
  stylesheets:
    featureVersion >= '1.4'
      ? []
      : [
          {
            theme: 'backoffice',
            rules: () =>
              import('./styles/themes/backoffice.styles').then(
                (m) => m.collapsibleBackofficeUI
              ),
          },
          {
            theme: 'storefront',
            rules: () =>
              import('./styles/themes/storefront.styles').then(
                (m) => m.collapsibleStorefrontUI
              ),
          },
        ],
});
