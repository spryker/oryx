import { ProductMediaContainerSize } from '@spryker-oryx/product';
import { LoadingStrategy } from '@spryker-oryx/ui/image';

export interface ResponsiveImage {
  src?: string;
  alt?: string;
  srcset?: string;
  loading?: string;
}

export interface ProductMediaOptions {
  containerSize?: ProductMediaContainerSize;

  /**
   * Indicates the media set by name. When there's no media set given, the
   * first media set is used.
   */
  mediaSet?: string;

  /**
   * Defines the index of the product media from the set of images.
   * If not provided, the first image will be resolved.
   *
   * @default 0
   */
  mediaIndex?: number;

  /**
   * The alt text is added to the img element, it is import for SEO and
   * accessibility. When the property is not provided, the product name
   * will be used for the alt `attribute`.
   */
  alt?: string;

  /**
   * The loading strategy is applied to the img element. The lazy loading
   * strategy drives a boosted performance in most cases as it will start
   * loading images only when they're in the viewport.
   *
   * @default LoadingStrategy.Lazy
   */
  loading: LoadingStrategy;
}
