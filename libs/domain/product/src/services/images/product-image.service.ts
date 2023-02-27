import {
  ImageSource,
  ProductMedia,
  ProductMediaContainerSize,
} from '../../models';

/**
 * The `ProductImageService` resolves the best image source(s) for the given
 * product image. Product images are typically provided in different sizes, so
 * that for each usage (e.g. thumbnail vs fullscreen) an optimised size can be used.
 *
 * Product images support optimised images for the requested context. The context
 * contains the media query as well as device screen density and connection speed.
 * The most optimised image size(s) will be resolved for the given image and context.
 */
export interface ProductImageService {
  /**
   * Resolves all the image sources for the requested format.
   */
  resolveSources(
    image?: ProductMedia,
    format?: ProductMediaContainerSize
  ): ImageSource[];
}

export const ProductImageService = 'oryx.ProductImageService';

declare global {
  interface InjectionTokensContractMap {
    [ProductImageService]: ProductImageService;
  }
}
