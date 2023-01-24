import { Observable } from 'rxjs';

export const DataTransmitterService = 'oryx.DataTransmitterService';

export interface DataTransmitterService {
  initialize(): Observable<unknown>;
}

declare global {
  interface InjectionTokensContractMap {
    [DataTransmitterService]: DataTransmitterService;
  }
}
