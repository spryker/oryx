import { Observable } from 'rxjs';
import { User } from '../../models';

export interface UserAdapter {
  get: () => Observable<User>;
}

export const UserAdapter = 'FES.OryxUserAdapter';

declare global {
  interface InjectionTokensContractMap {
    [UserAdapter]: UserAdapter;
  }
}
