import { FormFieldOption } from '@spryker-oryx/form';
import { Observable } from 'rxjs';

export interface SalutationService {
  get(): Observable<FormFieldOption[]>;
}

export const SalutationService = 'oryx.SalutationService';

declare global {
  interface InjectionTokensContractMap {
    [SalutationService]: SalutationService;
  }
}
