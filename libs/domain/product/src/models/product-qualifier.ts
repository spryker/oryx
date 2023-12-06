export interface ProductQualifier {
  sku?: string;
  /** TODO: should be augmented */
  offer?: string;
  /** @deprecated since 1.4 */
  include?: string[];
}
