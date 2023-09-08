import { Observable } from 'rxjs';
import { Option } from '../../models';

export interface GenderService {
  get(): Observable<Option[]>;
}

export const GenderService = 'oryx.GenderService';

declare global {
  interface InjectionTokensContractMap {
    [GenderService]: GenderService;
  }
}
