export interface ProductCategoryQualifier {
  id?: string;
  /** limit result to direct children categories of the parent */
  parent?: string;
  /** exclude category or cateories from the result */
  exclude?: string | string[];
}
