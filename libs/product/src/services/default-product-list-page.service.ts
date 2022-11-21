import { RouterService } from '@spryker-oryx/experience';
import { inject } from '@spryker-oryx/injector';
import {
  ProductList,
  ProductListPageService,
  ProductListQualifier,
  ProductListService,
} from '@spryker-oryx/product';
import { NullableGeneric } from '@spryker-oryx/utilities/typescript';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

export class DefaultProductListPageService implements ProductListPageService {
  constructor(
    protected routerService = inject(RouterService),
    protected productListService = inject(ProductListService)
  ) {}

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
