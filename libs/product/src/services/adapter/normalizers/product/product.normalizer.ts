import { Transformer, TransformerService } from '@spryker-oryx/core';
import { camelize } from '@spryker-oryx/core/utilities';
import { Provider } from '@spryker-oryx/injector';
import { map, Observable } from 'rxjs';
import { ApiProductModel, Product } from '../../../../models';
import { AvailabilityNormalizer } from '../availability';
import { ImagesNormalizer } from '../images';
import { ProductLabelsNormalizer } from '../labels/labels.normalizer';
import { PriceNormalizer } from '../price';
import { DeserializedProduct } from './model';

export const ProductNormalizer = 'FES.ProductNormalizer*';

export function productAttributeNormalizer(
  data: DeserializedProduct
): Partial<Product> {
  const {
    sku,
    name,
    description,
    averageRating,
    reviewCount,
    attributes,
    attributeNames,
  } = data;

  return {
    sku,
    name,
    description,
    averageRating: averageRating ? Number(averageRating) : 0,
    reviewCount,
    attributes,
    attributeNames,
  };
}

export function productPriceNormalizer(
  data: DeserializedProduct,
  transformer: TransformerService
): Observable<Partial<Product>> {
  const priceKey = camelize(ApiProductModel.Includes.ConcreteProductPrices);
  const { [priceKey]: price } = data;

  return transformer
    .transform(price?.[0], PriceNormalizer)
    .pipe(map((price) => ({ price })));
}

export function productLabelsNormalizer(
  data: DeserializedProduct,
  transformer: TransformerService
): Observable<Partial<Product>> {
  const labelsKey = camelize(ApiProductModel.Includes.Labels);
  const { [labelsKey]: labels } = data;

  return transformer
    .transform(labels, ProductLabelsNormalizer)
    .pipe(map((labels) => ({ labels })));
}

export function productImagesNormalizer(
  data: DeserializedProduct,
  transformer: TransformerService
): Observable<Partial<Product>> {
  const imageKey = camelize(ApiProductModel.Includes.ConcreteProductImageSets);
  const { [imageKey]: images } = data;

  return transformer
    .transform(images?.[0], ImagesNormalizer)
    .pipe(map((images) => ({ images })));
}

export function productAvailabilityNormalizer(
  data: DeserializedProduct,
  transformer: TransformerService
): Observable<Partial<Product>> {
  const stockKey = camelize(
    ApiProductModel.Includes.ConcreteProductAvailabilities
  );
  const { [stockKey]: availability } = data;

  return transformer
    .transform(availability?.[0], AvailabilityNormalizer)
    .pipe(map((availability) => ({ availability })));
}

export const productNormalizer: Provider[] = [
  {
    provide: ProductNormalizer,
    useValue: productAttributeNormalizer,
  },
  {
    provide: ProductNormalizer,
    useValue: productPriceNormalizer,
  },
  {
    provide: ProductNormalizer,
    useValue: productImagesNormalizer,
  },
  {
    provide: ProductNormalizer,
    useValue: productLabelsNormalizer,
  },
  {
    provide: ProductNormalizer,
    useValue: productAvailabilityNormalizer,
  },
];

declare global {
  interface InjectionTokensContractMap {
    [ProductNormalizer]: Transformer<Product>[];
  }
}
