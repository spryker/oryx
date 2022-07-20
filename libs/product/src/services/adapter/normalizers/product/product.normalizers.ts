import { Transformer, TransformerService } from '@spryker-oryx/core';
import { camelize } from '@spryker-oryx/typescript-utils';
import { map, Observable } from 'rxjs';
import {
  ApiProductModel,
  Product,
  ProductImage,
  ProductPrices,
} from '../../../../models';
import { ImagesNormalizers } from '../images';
import { PriceNormalizers } from '../price';
import { DeserializedProduct } from './model';

export const ProductNormalizers = 'FES.ProductNormalizers';

export function productAttributeNormalizer(
  data: DeserializedProduct
): Partial<Product> {
  const { sku, name, description, averageRating, reviewCount } = data;

  return {
    sku,
    name,
    description,
    averageRating: averageRating ? Number(averageRating) : 0,
    reviewCount,
  };
}

export function productPriceNormalizer(
  data: DeserializedProduct,
  transformer: TransformerService
): Observable<Partial<Product>> {
  const priceKey = camelize(ApiProductModel.Includes.ConcreteProductPrices);
  const { [priceKey]: price } = data;

  return transformer
    .transform<ProductPrices>(price?.[0], PriceNormalizers)
    .pipe(
      map((price) => ({
        price,
      }))
    );
}

export function productImagesNormalizer(
  data: DeserializedProduct,
  transformer: TransformerService
): Observable<Partial<Product>> {
  const imageKey = camelize(ApiProductModel.Includes.ConcreteProductImageSets);
  const { [imageKey]: images } = data;

  return transformer
    .transform<ProductImage[]>(images?.[0], ImagesNormalizers)
    .pipe(
      map((images) => ({
        images,
      }))
    );
}

export const productNormalizers = [
  productAttributeNormalizer,
  productPriceNormalizer,
  productImagesNormalizer,
];

declare global {
  interface InjectionTokensContractMap {
    [ProductNormalizers]: Transformer[];
  }
}
