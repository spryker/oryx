import { Facet } from '@spryker-oryx/product';
import { Observable } from 'rxjs';
import { FacetQualifier } from '../models';

export interface FacetListService {
  get(): Observable<Facet[] | null>;
  getFacet(options: FacetQualifier): Observable<Facet>;
}

export const FacetListService = 'oryx.FacetListService';

declare global {
  interface InjectionTokensContractMap {
    [FacetListService]: FacetListService;
  }
}
