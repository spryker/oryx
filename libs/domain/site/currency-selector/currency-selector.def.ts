import { componentDef } from '@spryker-oryx/utilities';

export const siteCurrencySelectorComponent = componentDef({
  name: 'oryx-site-currency-selector',
  impl: () =>
    import('./currency-selector.component').then(
      (m) => m.SiteCurrencySelectorComponent
    ),
  schema: import('./currency-selector.schema').then(
    (m) => m.siteCurrencySelectorSchema
  ),
});
