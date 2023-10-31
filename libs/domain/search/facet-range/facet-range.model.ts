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
  /**
   * Property that specifies the minimum active value of the range and value for min input
   */
  min?: number;
  /**
   * Property that specifies the maximum active value of the range and value for max input
   */
  max?: number;
}
