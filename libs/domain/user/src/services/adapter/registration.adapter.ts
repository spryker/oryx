import { ApiUserModel, User } from '@spryker-oryx/user';
import { Observable } from 'rxjs';

export interface RegistrationAdapter {
  register: (data: User) => Observable<ApiUserModel.User>;
}

export const RegistrationAdapter = 'oryx.RegistrationAdapter';

declare global {
  interface InjectionTokensContractMap {
    [RegistrationAdapter]: RegistrationAdapter;
  }
}
