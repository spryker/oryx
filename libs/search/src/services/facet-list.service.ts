import { Facet } from '@spryker-oryx/product';
import { NullableGeneric } from '@spryker-oryx/utilities/typescript';
import { Observable } from 'rxjs';
import { FacetQualifier } from '../models';

export interface FacetListService {
  get(): Observable<NullableGeneric<Facet[]>>;
  getFacet(options: FacetQualifier): Observable<Facet>;
}

export const FacetListService = 'FES.FacetListService';

declare global {
  interface InjectionTokensContractMap {
    [FacetListService]: FacetListService;
  }
}
