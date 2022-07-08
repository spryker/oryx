import { TransformerService } from '@spryker-oryx/core';
import { camelize } from '@spryker-oryx/typescript-utils';
import { ApiModel, Product } from '../../../../models';
import { ImagesNormalizer } from '../images';
import { DeserializedProduct } from '../model';
import { PriceNormalizer } from '../price';

export const productNormalizer = [
  (data: DeserializedProduct, transformer: TransformerService): Product => {
    const priceKey = camelize(ApiModel.INCLUDES.CONCRETE_PRODUCT_PRICES);
    const imageKey = camelize(ApiModel.INCLUDES.CONCRETE_PRODUCT_IMAGE_SETS);

    const {
      sku,
      name,
      description,
      averageRating,
      reviewCount,
      [imageKey]: images,
      [priceKey]: price,
    } = data;

    return {
      sku,
      name,
      description,
      averageRating: averageRating ? Number(averageRating) : 0,
      reviewCount,
      images: transformer.transform(images?.[0], ImagesNormalizer),
      price: transformer.transform(price?.[0], PriceNormalizer),
    };
  },
];
