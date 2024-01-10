import { inject } from '@spryker-oryx/di';
import { JsonLdNormalizer } from '@spryker-oryx/site';
import { Observable, map, of } from 'rxjs';
import { ProductCategoryService } from '..';
import { Product } from '../../models';
import { ProductJSONLD } from './model';

export class ProductJsonLdNormalizer implements JsonLdNormalizer<Product> {
  protected productCategoryService = inject(ProductCategoryService);

  normalize(product: Product): Observable<ProductJSONLD | undefined> {
    if (!product) return of(undefined);

    const categoryId = product?.categoryIds?.[0];

    if (!categoryId) return of(this.map(product));

    return this.productCategoryService
      .get({ id: categoryId })
      .pipe(map((category) => this.map(product, category.name)));
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
