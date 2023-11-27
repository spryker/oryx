export interface ProductCategoryListOptions {
  heading?: string;

  id?: string;

  /**
   * Excludes categories from the list.
   *
   * The `exclude` property can be specified in different formats:
   * - A comma-separated string of category IDs.
   * - An array of category IDs.
   *
   * The category IDs can be an actual ID or a range notation, like `>5`, `<4`, `4..11`.
   *
   * Examples:
   * ```ts
   * const excludeString = "1, 2, 3";
   * const excludeArray = [4, 5, 6];
   * const excludeRange = ">8";
   * ```
   *
   * @remarks
   * The `exclude` string or array can contain notations to specify which IDs should be excluded.
   * Notations include:
   * - `>X` for excluding IDs greater than X.
   * - `<X` for excluding IDs less than X.
   * - `X..Y` for excluding IDs within the range of X to Y (inclusive).
   */
  exclude?: string | string[];
}

export interface ProductCategoryListAttributes {
  /**
   * Optional category id to filter products by.
   */
  categoryId?: string;
}
