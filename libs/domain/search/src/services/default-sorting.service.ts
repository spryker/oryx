import { inject } from '@spryker-oryx/di';
import { ProductListPageService, ProductListSort } from '@spryker-oryx/product';
import { Observable, map } from 'rxjs';
import { SortingService } from './sorting.service';

export class DefaultSortingService implements SortingService {
  constructor(protected productListService = inject(ProductListPageService)) {}

  get(): Observable<ProductListSort | null> {
    return this.productListService.get().pipe(map((pl) => pl?.sort ?? null));
  }
}
