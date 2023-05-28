export interface FacetsOptions {
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
   * Excludes the facet from the facet navigation. The exclusions must contain the facet parameters,
   * such as `price` or `rating`.
   *
   * Excluding a facet can be done if there's no (appropriate) facet implementation available or if the
   * facet should not be used for the current site.
   */
  exclusions?: string[];
}
