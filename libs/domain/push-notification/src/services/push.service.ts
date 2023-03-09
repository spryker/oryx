import { Observable } from 'rxjs';

export interface PushService {
  init(): Observable<void>;
  subscribe(): Observable<any>;
  unsubscribe(): Observable<boolean>;
}

export interface PushServiceConfig {
  readonly apiUrl: string;
}

export const pushApiType = 'web';

export const PushService = 'oryx.PushService';
export const PushServiceConfig = 'oryx.PushServiceConfig';

declare global {
  export interface InjectionTokensContractMap {
    [PushService]: PushService;
    [PushServiceConfig]: PushServiceConfig;
  }
}
