export interface SearchFacetNavigationOptions {
  /**
   * Indicates the number of facets that are visible on the page. This is useful when
   * the page comes with a lot of facets, which would create a very busy facet navigation.
   * To control this list, you can collapse items after a certain count.
   *
   * @default 5
   */
  expandedItemsCount?: number;

  /**
   * Indicates the number values that are visible for a facet. This limit is introduced to avoid
   * a lengthy list with values. Additional controls will be added to access all values.
   *
   * @default 5;
   */
  valueRenderLimit?: number;

  /**
   * Indicates the minimum number of facet values that must be present for a search box
   * to be enabled for searching facet values. For example, if the color facet contains
   * more than 13 color values, a search box will be offered to search for a specific color.
   *
   * @default 13
   */
  minForSearch?: number;

  /**
   * Provides a mechanism to bury specific facets, which means that they will not be shown in the
   * facet navigation. Going forward, we can bury facets for specific categories, by extending this
   * object with a category.
   */
  bury?: { facets: string[] }[];

  /**
   * Indicates the minimum rating value for a rating facet.
   *
   * @default 1
   */
  ratingMin?: number;

  /**
   * Indicates the maximum rating value for a rating facet.
   *
   * @default 4
   */
  ratingMax?: number;

  /**
   * Indicates the scale for a rating facet.
   *
   * @default 5
   */
  ratingScale?: number;
}
