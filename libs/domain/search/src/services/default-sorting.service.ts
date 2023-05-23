import { inject } from '@spryker-oryx/di';
import { ProductListPageService, ProductListSort } from '@spryker-oryx/product';
import { map, Observable } from 'rxjs';

export class DefaultSortingService {
  constructor(protected productListService = inject(ProductListPageService)) {}

  get(): Observable<ProductListSort | null> {
    return this.productListService.get().pipe(map((pl) => pl?.sort ?? null));
  }
}
