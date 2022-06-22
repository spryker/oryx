import { Observable } from 'rxjs';

export interface UserData {
  token?: string;
  anonymousUserId?: string;
}

export interface UserService {
  get(): Observable<UserData>;
}

export const UserService = 'FES.UserService';

declare global {
  interface InjectionTokensContractMap {
    [UserService]: UserService;
  }
}
