import { FormFieldOption } from '@spryker-oryx/form';
import { Observable } from 'rxjs';

export interface GenderService {
  get(): Observable<FormFieldOption[]>;
}

export const GenderService = 'oryx.GenderService';

declare global {
  interface InjectionTokensContractMap {
    [GenderService]: GenderService;
  }
}
