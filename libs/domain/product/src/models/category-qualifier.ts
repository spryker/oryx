export interface ProductCategoryQualifier {
  id?: string;
  /** Limit result to direct children categories of the parent */
  parent?: string;
  /** Exclude category or categories IDs from the result */
  exclude?: string | string[];
}
