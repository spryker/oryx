import { AccessToken } from './access-token';

export interface Identity {
  id: string;
  anonymous: boolean;
  token?: AccessToken;
}
