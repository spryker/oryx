import { Observable } from 'rxjs';
import { User } from '../models';

export interface UserService {
  getUser(): Observable<User | null>;
  getLoadingState(): Observable<boolean>;
}

export const UserService = 'oryx.UserService';

declare global {
  interface InjectionTokensContractMap {
    [UserService]: UserService;
  }
}
