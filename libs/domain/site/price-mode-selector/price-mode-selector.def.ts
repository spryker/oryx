import { componentDef } from '@spryker-oryx/utilities';

export const sitePriceModeSelectorComponent = componentDef({
  name: 'oryx-price-mode-selector',
  impl: () =>
    import('./price-mode-selector.component').then(
      (m) => m.SitePriceModeSelectorComponent
    ),
  schema: import('./price-mode-selector.schema').then(
    (m) => m.sitePriceModeSelectorSchema
  ),
});
