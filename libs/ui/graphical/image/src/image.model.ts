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

export interface ImageComponentAttributes {
  /**
   * Specifies the path to the image you want to embed.
   */
  src?: string;

  /**
   * Indicates possible image sources that are used to render an image for different
   * devices or screen sizes.
   */
  srcset?: string;

  /**
   * Specifies an alternate text for an image that is used by crawlers and screen
   * readers.
   */
  alt?: string;

  /**
   * Provides a loading strategy for the image. The lazy loading strategy is leveraging
   * native lazy loading on the web platform, which means that images are loaded when
   * they're in the viewport. This will optimise the experience as (heavy) resources
   * are not all loaded up front while there not visible to the user.
   *
   * @default `LoadingStrategy.Lazy`
   */
  loading?: LoadingStrategy;

  /**
   * Represents a resource token that is used to resolve an image from
   * the available resources.
   *
   * Resources can be provided as presets for an application. This concept is useful
   * to create (demo) applications that do not rely on any deployed resources, such as
   * a logo or a graphic in the order confirmation page.
   *
   * In production, pre-set images  are typically replaced by _content managed_ images.
   */
  resource?: string;
}
