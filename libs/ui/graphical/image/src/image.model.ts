export const enum LoadingStrategy {
  /**
   * Used to fetch a resource immediately.
   */
  Eager = 'eager',
  /**
   * Used to fetch a resource when the element is in the viewport.
   */
  Lazy = 'lazy',
}
