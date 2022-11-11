import { Facet } from '@spryker-oryx/product';
import { NullableGeneric } from '@spryker-oryx/typescript-utils';
import { Observable } from 'rxjs';

export interface FacetListService {
  get(): Observable<NullableGeneric<Facet[]>>;
}

export const FacetListService = 'FES.FacetListService';

declare global {
  interface InjectionTokensContractMap {
    [FacetListService]: FacetListService;
  }
}
