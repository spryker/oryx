import { Observable } from 'rxjs';
import { User } from '../../models';

export interface UserAdapter {
  get: () => Observable<User>;
}

export const UserAdapter = 'oryx.OryxUserAdapter';

declare global {
  interface InjectionTokensContractMap {
    [UserAdapter]: UserAdapter;
  }
}
