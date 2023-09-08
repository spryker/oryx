import { Observable } from 'rxjs';
import { Option } from '../../models';

export interface SalutationService {
  get(): Observable<Option[]>;
}

export const SalutationService = 'oryx.SalutationService';

declare global {
  interface InjectionTokensContractMap {
    [SalutationService]: SalutationService;
  }
}
