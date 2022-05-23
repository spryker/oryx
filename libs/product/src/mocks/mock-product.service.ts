import { Observable, of, throwError } from 'rxjs';
import { Product } from '../models/product';
import { ProductQualifier } from '../models/product-qualifier';
import { ProductService } from '../services/product.service';

export class MockProductService implements Partial<ProductService> {
  mockProducts: Product[] = [
    {
      sku: '1',
      name: 'Sample product',
    },
    {
      sku: '2',
      name: 'Second sample product',
    },
    {
      sku: '3',
      name: 'Sample product no. 3',
    },
  ];

  get(qualifier: ProductQualifier): Observable<Product> {
    const product = this.mockProducts.find((p) => p.sku === qualifier.sku);
    return product
      ? of(product)
      : throwError(() => new Error('Product not found'));
  }
}
