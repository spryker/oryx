import { SearchFacetComponentAttributes } from '@spryker-oryx/search/facet';

export type SearchRatingFacetComponentProperties = Omit<
  SearchFacetComponentAttributes,
  'multi' | 'renderLimit' | 'minForSearch'
>;
export interface SearchRatingFacetComponentOptions {
  /**
   * Indicates the minimum rating value for a rating facet.
   * This value must be greater than 0 and must be less than or equal to the `max` rating value.
   *
   * @default 1
   */
  min?: number;

  /**
   * Indicates the maximum rating value for a rating facet.
   * This value must be greater than or equal to the `min` rating value and
   * must be less than or equal to the `scale`.
   *
   * @default 4
   */
  max?: number;

  /**
   * Indicates the rating scale (maximum rating that a product can have).
   * This value must be greater than or equal to the `max` rating value.
   *
   * @default 5
   */
  scale?: number;
}
