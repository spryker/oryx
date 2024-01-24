import { ProductMedia, ProductMediaNormalizer } from '@spryker-oryx/product';
import { Size } from '@spryker-oryx/utilities';
import { ApiProductModel } from '../../../models/product.api.model';

export const DefaultProductMediaNormalizer = `${ProductMediaNormalizer}Default`;

export function mediaNormalizer(
  data?: ApiProductModel.Image | undefined
): ProductMedia {
  const sources: ProductMedia = {};
  if (data) {
    const { externalUrlSmall, externalUrlLarge } = data;

    if (externalUrlSmall) {
      sources[Size.Sm] = externalUrlSmall;
    }

    if (externalUrlLarge !== externalUrlSmall) {
      sources[Size.Lg] = externalUrlLarge;
    }
  }
  return sources;
}
