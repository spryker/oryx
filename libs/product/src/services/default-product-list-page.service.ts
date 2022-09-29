import { RouterService } from '@spryker-oryx/experience';
import { inject } from '@spryker-oryx/injector';
import {
  ProductList,
  ProductListPageService,
  ProductListService,
} from '@spryker-oryx/product';
import { NullableGeneric } from '@spryker-oryx/typescript-utils';
import { Observable } from 'rxjs';

export class DefaultProductListPageService implements ProductListPageService {
  constructor(
    protected routerService = inject(RouterService),
    protected productListService = inject(ProductListService)
  ) {}

  get(): Observable<NullableGeneric<ProductList>> {
    return this.productListService.get(this.routerService.getUrlParams());
  }
}
