import { inject } from '@spryker-oryx/di';
import { Size, sizes } from '@spryker-oryx/utilities';
import {
  ImageSource,
  MediaContext,
  ProductMedia,
  ProductMediaContainerSize,
} from '../../models';
declare global {
  interface Navigator {
    connection?: {
      effectiveType: string;
    };
  }
}

import { ProductImageService } from './product-image.service';
import { ProductMediaConfig } from './product-media.config';

export class DefaultProductImageService implements ProductImageService {
  constructor(protected mediaConfig = inject(ProductMediaConfig)) {}

  /**
   * Resolves the required source(s) for the requested format.
   */
  resolveSources(
    image?: ProductMedia,
    format?: ProductMediaContainerSize
  ): ImageSource[] {
    if (!image || !format) {
      return [];
    }

    const config = this.mediaConfig[format];
    const sources = [];

    config?.sizes?.forEach(({ size, context }) => {
      const url = image[size];
      if (url && this.compliesWithContext(context)) {
        sources.push({ url, size, context });
      }
    });

    if (!sources.length) {
      const alternative = this.resolveAlternative(image, format);
      if (alternative) {
        sources.push(alternative);
      }
    }
    return sources;
  }

  /**
   * Returns an alternative quality image, based on the given size. The lower quality is first evaluated
   * before higher quality is evaluated.
   *
   * Alternative size is indicated by the next size in row. E.g., when the size
   * is `Md`, the quality degradation will evaluate `Sm` and `Xs`. When an image is
   * available for the given size it will return this image source.
   */
  protected resolveAlternative(
    image: ProductMedia,
    format: ProductMediaContainerSize
  ): ImageSource | undefined {
    let source: ImageSource | undefined = undefined;
    const formatSizes = this.getSortedSizes(format);
    if (formatSizes?.length) {
      // try to find an image size before or after the current size index
      [-1, 1].forEach((nextIndex) => {
        let alternativeSize = sizes[sizes.indexOf(formatSizes[0]) + nextIndex];
        while (!source && alternativeSize) {
          const url = image[alternativeSize];
          if (url) {
            source = {
              url,
              size: alternativeSize,
            };
          }
          alternativeSize = sizes[sizes.indexOf(alternativeSize) + nextIndex];
        }
      });
    }
    if (!source) {
      source = this.findUnassignedSize(image);
    }

    return source;
  }

  // we're caching sorted media sizes for all formats to avoid too much computing
  protected sortedMediaConfigSizes: {
    [key in ProductMediaContainerSize]?: Size[];
  } = {};

  protected getSortedSizes(
    format: ProductMediaContainerSize
  ): Size[] | undefined {
    if (!this.sortedMediaConfigSizes[format]) {
      this.sortedMediaConfigSizes[format] = this.mediaConfig[format]?.sizes
        ?.map((format) => format.size)
        .sort((a, b) => sizes.indexOf(a) - sizes.indexOf(b));
    }
    return this.sortedMediaConfigSizes[format];
  }

  /**
   * Finds the next smallest image. This is used when there's no configuration available
   * that helps to pick the size.
   */
  protected findUnassignedSize(image: ProductMedia): ImageSource | undefined {
    // TODO: remove when es2023 lib for ts will be released https://github.com/microsoft/TypeScript/issues/48829
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const size: Size = sizes.findLast((size) => !!image[size]);
    return size
      ? {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          url: image[size]!,
          size: size,
        }
      : undefined;
  }

  /**
   * Indicates whether the given context complies with the client setup.
   *
   * This only contains a validation with the connection speed of the user.
   * The connection speed can only be tested client side and doesn't have full
   * browser support.
   *
   * Other context aspect, such as pixel density, are ignored in this validation
   * since the browser will handle them.
   */
  protected compliesWithContext(context?: MediaContext): boolean {
    return context?.connection !== 'fast' || this.hasFastConnection();
  }

  /**
   * This method indicates whether the current connection is 4g or 5g.
   *
   * This will always return false on the server or in browsers that do
   * not (yet) support this API.
   *
   * Note: Safari said it won't support this API because of privacy concerns
   * (fingerprinting).
   */
  protected hasFastConnection(): boolean {
    const effectiveType = window?.navigator?.connection?.effectiveType;
    return !effectiveType || ['4g', '5g'].includes(effectiveType);
  }
}
