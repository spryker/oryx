import { Size } from '@spryker-oryx/ui';
import { MediaContext, ProductMediaContainerSize } from '../../models';

/**
 * Allows to configure product media dimensions, sizes and context per
 * format.
 */
export const ProductMediaConfig = 'oryx.ProductMediaConfig';

const qualityContext: MediaContext = { density: 2, connection: 'fast' };
const highQualityContext: MediaContext = { density: 3, connection: 'fast' };

export type ProductMediaConfig = {
  [key in ProductMediaContainerSize]?: {
    dimensions?: { width?: number; aspectRatio: string };
    sizes?: { context?: MediaContext; size: Size }[];
  };
};

declare global {
  interface InjectionTokensContractMap {
    [ProductMediaConfig]: ProductMediaConfig;
  }
}

export const productMediaConfig: ProductMediaConfig = {
  icon: {
    sizes: [
      { size: Size.Xs },
      {
        context: qualityContext,
        size: Size.Sm,
      },
    ],
  },
  thumbnail: {
    sizes: [
      { size: Size.Sm },
      {
        context: qualityContext,
        size: Size.Md,
      },
    ],
  },
  detail: {
    sizes: [
      { size: Size.Md },
      { size: Size.Lg, context: qualityContext },
      { size: Size.Xl, context: highQualityContext },
    ],
  },
  full: { sizes: [{ size: Size.Xl }] },
};
