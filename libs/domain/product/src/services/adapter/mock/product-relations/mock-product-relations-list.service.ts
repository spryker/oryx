import {
  Product,
  ProductQualifier,
  ProductRelationsListService,
} from '@spryker-oryx/product';
import { Observable, of } from 'rxjs';
import { mockProducts } from '../mock-product';

export class MockProductRelationsListService
  implements ProductRelationsListService
{
  get({ sku }: ProductQualifier): Observable<Product[] | undefined> {
    return of([
      mockProducts[Number(sku) - 1],
      mockProducts[Number(sku)],
      mockProducts[Number(sku) + 1],
    ]);
  }
}
