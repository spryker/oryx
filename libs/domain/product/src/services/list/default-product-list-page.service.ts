import { inject } from '@spryker-oryx/di';
import { RouterService } from '@spryker-oryx/router';
import { map, Observable, switchMap } from 'rxjs';
import { Pagination, ProductList } from '../../models';
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

  get(): Observable<ProductList | undefined> {
    return this.routerService.currentQuery().pipe(
      switchMap((params) => {
        const categoryId = this.routerService.getPathId('category');
        return this.productListService.get(
          categoryId ? { ...params, category: categoryId } : params ?? {}
        );
      })
    );
  }
}
