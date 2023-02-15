import { Observable } from 'rxjs';
import { Salutation } from '../../models';

export interface SalutationService {
  get(): Observable<Salutation[]>;
}

export const SalutationService = 'oryx.SalutationService';

declare global {
  interface InjectionTokensContractMap {
    [SalutationService]: SalutationService;
  }
}
