import { Provider } from '@spryker-oryx/di';
import {
  ApiProductModel,
  DefaultProductMediaNormalizer,
} from '@spryker-oryx/product';
import { Size } from '@spryker-oryx/ui';

/**
 * Cloudinary provides an http API that can be used to _fetch_ remote resource and enable on-the-fly
 * transformation. The transformed image got distributed on the Cloudinary CDN.
 *
 * The CLOUDINARY_ID is required to resolve images from Cloudinary. You can use a free plan to resolve images
 * in non-production environments.
 */
const fetchUrl = `https://res.cloudinary.com/${
  (<any>import.meta).env.ORYX_CLOUDINARY_ID
}/image/fetch/`;

/**
 * Simple product image convertor that takes the large product image and assigns it to different image formats.
 * This provides:
 * - optimized images size (eg. xs, sm, lg)
 * - optimized image formats (typically using webP)
 * - transparent image backgrounds
 * - distributed images (no network latency)
 */
export const cloudinaryImageConverter: Provider = {
  provide: DefaultProductMediaNormalizer,
  useValue: (image: ApiProductModel.Image) => {
    return {
      [Size.Xs]: `${fetchUrl}/e_bgremoval/w_100,f_auto/${
        image.externalUrlSmall ?? image.externalUrlLarge
      }`,
      [Size.Sm]: `${fetchUrl}/e_bgremoval/w_250,f_auto/${
        image.externalUrlSmall ?? image.externalUrlLarge
      }`,
      [Size.Lg]: `${fetchUrl}/e_bgremoval/f_auto/${
        image.externalUrlLarge ?? image.externalUrlSmall
      }`,
    };
  },
};
