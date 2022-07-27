export interface SiteSearchboxProperties {
  /**
   * Query string that is using for suggestions search
   */
  query?: string;
}

export interface SiteSearchboxOptions {
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

  /**
   * @default 'Search'
   */
  placeholder?: string;

  /**
   * @default 'Clear'
   */
  clearButtonTitle?: string;

  /**
   * @default 'Close results'
   */
  closeButtonArialLabel?: string;

  /**
   * @default 'Nothing found…'
   */
  nothingFoundText?: string;

  /**
   * @default 'Search suggestions'
   */
  completionTitle?: string;

  /**
   * @default 'In categories'
   */
  categoriesTitle?: string;

  /**
   * @default 'In CMS pages'
   */
  cmsTitle?: string;

  /**
   * @default 'Products'
   */
  productsTitle?: string;

  /**
   * @default 'View all products'
   */
  viewAllProductsButtonTitle?: string;
}
