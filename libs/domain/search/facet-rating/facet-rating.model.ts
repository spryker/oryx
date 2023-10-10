export interface RatingFacetComponentOptions {
  /**
   * Indicates the minimum rating value for a rating facet.
   *
   * @default 1
   */
  min?: number;

  /**
   * Indicates the maximum rating value for a rating facet.
   *
   * @default 4
   */
  max?: number;

  /**
   * Indicates the scale for a rating facet.
   *
   * @default 5
   */
  scale?: number;
}
