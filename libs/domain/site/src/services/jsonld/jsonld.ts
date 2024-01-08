import { Observable } from 'rxjs';
import { JSONLD } from './jsonld.model';

export interface JsonLdNormalizer<T = any> {
  normalize(source: T): Observable<JSONLD | undefined>;
}

export const JsonLdNormalizer = 'oryx.JsonLdNormalizer*';

declare global {
  interface InjectionTokensContractMap {
    [JsonLdNormalizer]: JsonLdNormalizer;
  }
}
