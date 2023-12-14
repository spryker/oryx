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

  /**
   * Allows to use additional services to get qualifier from received data.
   */
  context?: string;

  /**
   * Chooses key field to use for data from context service.
   *
   * Required if context is set.
   */
  field?: string;

  /**
   * Defines context data behavior for content searching.
   *
   * Required if context is set.
   *
   * @default 'tags'.
   */
  behavior?: 'type' | 'query' | 'tags';
}
