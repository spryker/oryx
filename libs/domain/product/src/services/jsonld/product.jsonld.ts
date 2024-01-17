import { ClassTransformer } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import { Observable, map, of, take } from 'rxjs';
import { ProductCategoryService } from '..';
import { Product } from '../../models';
import { ProductJSONLD } from './model';

export class ProductJsonLdNormalizer
  implements ClassTransformer<ProductJSONLD, Product>
{
  protected productCategoryService = inject(ProductCategoryService);

  transform(product: Product): Observable<ProductJSONLD | undefined> {
    if (!product) return of(undefined);

    const categoryId = product?.categoryIds?.[0];

    if (!categoryId) return of(this.map(product));

    return this.productCategoryService.get({ id: categoryId }).pipe(
      take(1),
      map((category) => this.map(product, category.name))
    );
  }

  protected map(product: Product, category?: string): ProductJSONLD {
    const { sku: identifier, name, description, attributes } = product;
    const { color, brand } = attributes ?? {};

    return {
      '@context': 'http://schema.org',
      '@type': 'Product',
      identifier,
      name,
      description,
      color,
      brand,
      category,
    };
  }
}
