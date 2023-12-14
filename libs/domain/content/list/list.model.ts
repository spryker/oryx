export interface ContentListOptions {
  /**
   * Performs content search by specific entity type.
   */
  type?: string;
  /**
   * Performs content search by query.
   */
  query?: string;
  /**
   * Performs content search by tags.
   */
  tags?: string[] | string;
}
