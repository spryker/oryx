export interface ProductLabelsOptions {
  /**
   * Includes the labels by name that are part of this list. If this list is empty,
   * it means that all labels are included.
   */
  included?: string;

  /**
   * Excludes the labels by name that are part of this list.
   */
  excluded?: string;
}
