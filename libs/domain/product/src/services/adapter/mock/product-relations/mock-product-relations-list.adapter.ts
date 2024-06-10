import {
  Product,
  ProductQualifier,
  ProductRelationsListAdapter,
} from '@spryker-oryx/product';
import { Observable, of } from 'rxjs';
import { mockProducts } from '../mock-product';

export class MockProductRelationsListAdapter
  implements ProductRelationsListAdapter
{
  get({ sku }: ProductQualifier): Observable<Product[] | undefined> {
    return of([
      mockProducts[Number(sku) - 1],
      mockProducts[Number(sku)],
      mockProducts[Number(sku) + 1],
    ]);
  }
}
