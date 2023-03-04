export interface SearchBoxProperties {
  /**
   * Query string that is using for suggestions search
   */
  query?: string;
}

export interface SearchBoxOptions {
  /**
   * Minimum amount of characters required for querying the suggestion
   */
  minChars?: number;

  /**
   * Maximum amount of completions to show
   * @default 5
   */
  completionsCount?: number;

  /**
   * Maximum amount of products to show
   * @default 6
   */
  productsCount?: number;

  /**
   * Maximum amount of categories to show
   * @default 5
   */
  categoriesCount?: number;

  /**
   * Maximum amount of CMS links to show
   * @default 5
   */
  cmsCount?: number;
}
