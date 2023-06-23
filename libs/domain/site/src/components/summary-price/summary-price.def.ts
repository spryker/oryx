import { componentDef } from '@spryker-oryx/core';
import { siteSummaryPriceRules } from './summary-price.styles';

export const siteSummaryPriceComponent = componentDef({
  name: 'oryx-site-summary-price',
  impl: () =>
    import('./summary-price.component').then(
      (m) => m.SiteSummaryPriceComponent
    ),
  stylesheets: [{ rules: siteSummaryPriceRules }],
});
