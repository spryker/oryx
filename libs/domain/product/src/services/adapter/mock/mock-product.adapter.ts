import { Product, ProductQualifier } from '@spryker-oryx/product';
import { Observable, of } from 'rxjs';
import { ProductAdapter } from '../../index';
import { mockProducts } from './mock-product';

export class MockProductAdapter implements ProductAdapter {
  getKey(qualifier: ProductQualifier): string {
    return (qualifier.sku ?? '') + qualifier.include?.sort()?.join('');
  }

  get(qualifier: ProductQualifier): Observable<Product> {
    const product = mockProducts.find(
      (p) => p.sku === qualifier.sku
    ) as Product;

    return of(product);
  }
}
