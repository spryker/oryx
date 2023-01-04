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
}
