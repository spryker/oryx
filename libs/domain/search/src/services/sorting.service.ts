import { ProductListSort } from '@spryker-oryx/product';
import { NullableGeneric } from '@spryker-oryx/utilities';
import { Observable } from 'rxjs';

export interface SortingService {
  get(): Observable<NullableGeneric<ProductListSort>>;
}

export const SortingService = 'oryx.SortingService';

declare global {
  interface InjectionTokensContractMap {
    [SortingService]: SortingService;
  }
}
