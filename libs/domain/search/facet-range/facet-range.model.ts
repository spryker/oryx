import { SearchFacetComponentAttributes } from '@spryker-oryx/search/facet';

export interface SearchFacetRangeComponentAttributes
  extends Omit<
      SearchFacetComponentAttributes,
      'multi' | 'renderLimit' | 'minForSearch'
    >,
    SearchFacetRangeComponentValues {
  /**
   * Step interval for the slider and inputs
   *
   * @default 1
   */
  step?: number;
  /**
   * Label for the minimum value input
   *
   * @default 'Min'
   */
  labelMin?: string;
  /**
   * Label for the maximum value input
   *
   * @default 'Max'
   */
  labelMax?: string;
}

export interface SearchFacetRangeComponentValues {
  min?: number;
  max?: number;
}
