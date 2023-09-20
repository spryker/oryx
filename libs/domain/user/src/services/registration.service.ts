import { Observable } from 'rxjs';
import { ApiUserModel } from '../models';

export interface RegistrationService {
  register(data: ApiUserModel.User): Observable<unknown>;
}

export const RegistrationService = 'oryx.RegistrationService';

declare global {
  interface InjectionTokensContractMap {
    [RegistrationService]: RegistrationService;
  }
}
