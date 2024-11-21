import {
  Product,
  ProductQualifier,
  ProductRelationsListService,
} from '@spryker-oryx/product';
import { Observable, of } from 'rxjs';
import { MockProductService } from '../mock-product.service';

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
