import {
  Product,
  ProductQualifier,
  ProductRelationsListService,
} from '@spryker-oryx/product';
import { MockProductService } from '@spryker-oryx/product/mocks';
import { Observable, of } from 'rxjs';

export class MockProductRelationsListService
  implements ProductRelationsListService
{
  get({ sku }: ProductQualifier): Observable<Product[] | undefined> {
    return of([
      MockProductService.mockProducts[Number(sku) - 1],
      MockProductService.mockProducts[Number(sku)],
      MockProductService.mockProducts[Number(sku) + 1],
    ]);
  }
}
