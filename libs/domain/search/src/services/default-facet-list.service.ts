import { inject } from '@spryker-oryx/di';
import { Facet, ProductListPageService } from '@spryker-oryx/product';
import { NullableGeneric } from '@spryker-oryx/utilities';
import { map, Observable } from 'rxjs';
import { FacetQualifier } from '../models';
import { FacetListService } from './facet-list.service';

export class DefaultFacetListService implements FacetListService {
  constructor(protected productListService = inject(ProductListPageService)) {}

  get(): Observable<NullableGeneric<Facet[]>> {
    return this.productListService.get().pipe(map((pl) => pl?.facets ?? []));
  }

  getFacet(options: FacetQualifier): Observable<Facet> {
    return this.get().pipe(
      map(
        (facets) =>
          facets?.find((facet) => facet.name === options.name) ?? ({} as Facet)
      )
    );
  }
}
