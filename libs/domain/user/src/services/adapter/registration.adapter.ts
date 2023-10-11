import { Observable } from 'rxjs';
import { User } from '../../models';

export interface RegistrationAdapter {
  register: (data: User) => Observable<User>;
}

export const RegistrationAdapter = 'oryx.RegistrationAdapter';

declare global {
  interface InjectionTokensContractMap {
    [RegistrationAdapter]: RegistrationAdapter;
  }
}
