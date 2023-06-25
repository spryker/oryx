import { PricesBehavior } from '@spryker-oryx/site';

export interface SiteTotalsItemOptions {
  type: string;
  discountRowsAppearance?: PricesBehavior;
  enableTaxMessage?: boolean;
}
