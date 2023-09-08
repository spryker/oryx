import { ApiUserModel } from '@spryker-oryx/user';
import { Observable } from 'rxjs';

export interface RegistrationAdapter {
  register: (data: ApiUserModel.CreateUser) => Observable<ApiUserModel.User>;
}

export const RegistrationAdapter = 'oryx.RegistrationAdapter';

declare global {
  interface InjectionTokensContractMap {
    [RegistrationAdapter]: RegistrationAdapter;
  }
}
