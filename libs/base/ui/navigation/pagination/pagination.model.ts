export interface PaginationProperties {
  /**
   * The page links that are slotted in the main component slot.
   */
  pages?: HTMLElement[];

  /**
   * Indicates whether the navigation links are rendered before and after.
   * The pagination navigation provides links to the previous and next
   * pages of the current page.
   */
  enableNavigation?: boolean;

  /**
   * Indicates the number of pages that visible at the same time.
   *
   * @default 5
   */
  max: number;

  /**
   * Indicates the current page.
   *
   * The current page is maintained inside the pagination component, but can
   * also be set by the host.
   *
   * @default 1
   */
  current: number;
}
