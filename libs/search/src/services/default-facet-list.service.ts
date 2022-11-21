import { inject } from '@spryker-oryx/injector';
import { Facet, ProductListPageService } from '@spryker-oryx/product';
import { NullableGeneric } from '@spryker-oryx/utilities/typescript';
import { map, Observable } from 'rxjs';
import { FacetListService } from './facet-list.service';

export class DefaultFacetListService implements FacetListService {
  constructor(protected productListService = inject(ProductListPageService)) {}

  get(): Observable<NullableGeneric<Facet[]>> {
    return this.productListService.get().pipe(map((pl) => pl?.facets ?? []));
  }
}
