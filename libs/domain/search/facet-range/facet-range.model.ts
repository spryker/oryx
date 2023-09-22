import { SearchFacetComponentAttributes } from '@spryker-oryx/search/facet';

export interface SearchFacetRangeComponentAttributes
  extends SearchFacetComponentAttributes {
  /**
   * Step interval for the slider and inputs
   *
   * @default 1
   */
  step?: number;
}
