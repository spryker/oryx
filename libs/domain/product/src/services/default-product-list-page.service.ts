import { inject } from '@spryker-oryx/di';
import { RouterService } from '@spryker-oryx/experience';
import { NullableGeneric } from '@spryker-oryx/utilities';
import { map, Observable, switchMap } from 'rxjs';
import { Pagination, ProductList, ProductListQualifier } from '../models';
import { ProductListPageService } from './product-list-page.service';
import { ProductListService } from './product-list.service';

export class DefaultProductListPageService implements ProductListPageService {
  constructor(
    protected routerService = inject(RouterService),
    protected productListService = inject(ProductListService)
  ) {}

  getPagination(): Observable<Pagination | undefined> {
    return this.get().pipe(map((pl) => pl?.pagination));
  }

  get(): Observable<NullableGeneric<ProductList>> {
    return this.routerService
      .currentQuery()
      .pipe(
        switchMap((params) =>
          this.productListService.get(params as ProductListQualifier)
        )
      );
  }
}
