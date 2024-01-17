import { Observable } from 'rxjs';
import { JSONLD } from './jsonld.model';

export interface JsonLdService {
  getSchemas(): Observable<JSONLD[] | undefined>;
}

export const JsonLdService = 'oryx.JsonLdService';

declare global {
  interface InjectionTokensContractMap {
    [JsonLdService]: JsonLdService;
  }
}
