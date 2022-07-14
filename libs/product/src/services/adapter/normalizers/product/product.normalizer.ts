import { Transformer, TransformerService } from '@spryker-oryx/core';
import { camelize } from '@spryker-oryx/typescript-utils';
import { ApiProductModel, Product } from '../../../../models';
import { ImagesNormalizer } from '../images';
import { PriceNormalizer } from '../price';
import { DeserializedProduct } from './model';

export const ProductNormalizer = 'FES.ProductNormalizer';

export const productNormalizer = [
  (data: DeserializedProduct, transformer: TransformerService): Product => {
    const priceKey = camelize(ApiProductModel.Includes.ConcreteProductPrices);
    const imageKey = camelize(
      ApiProductModel.Includes.ConcreteProductImageSets
    );

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

declare global {
  interface InjectionTokensContractMap {
    [ProductNormalizer]: Transformer[];
  }
}
