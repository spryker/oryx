import {
  AlternativeProductsListService,
  Product,
  ProductQualifier,
} from '@spryker-oryx/product';
import { MockProductService } from '@spryker-oryx/product/mocks';
import { Observable, of } from 'rxjs';

export class MockAlternativeProductListService
  implements AlternativeProductsListService
{
  get({ sku }: ProductQualifier): Observable<Product[] | undefined> {
    if (isNaN(Number(sku))) {
      return of([]);
    }
    return of([
      MockProductService.mockProducts[Number(sku) - 1],
      MockProductService.mockProducts[Number(sku)],
      MockProductService.mockProducts[Number(sku) + 1],
    ]);
  }
}
