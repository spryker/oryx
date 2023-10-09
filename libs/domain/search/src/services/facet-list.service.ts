import { Facet, RangeFacetValue } from '@spryker-oryx/product';
import { Observable } from 'rxjs';
import { FacetQualifier } from '../models';

export interface FacetListService {
  get(): Observable<Facet[] | null>;
  getFacet(options: FacetQualifier): Observable<Facet>;
  getRangeFacetParams(
    parameter: string
  ): Record<keyof Omit<RangeFacetValue, 'selected'>, string>;
}

export const FacetListService = 'oryx.FacetListService';

declare global {
  interface InjectionTokensContractMap {
    [FacetListService]: FacetListService;
  }
}
