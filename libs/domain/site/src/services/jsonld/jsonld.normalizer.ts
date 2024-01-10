import { Observable } from 'rxjs';
import { JSONLD } from './jsonld.model';

export interface JsonLdNormalizer<T = any> {
  normalize(source: T): Observable<JSONLD | undefined>;
}

export const JsonLdNormalizer = 'oryx.JsonLdNormalizer*';

/**
 * creates the json ld normalizer token for the given entity and (optional) normalizer.
 */
export const jsonLdTokenFactory = (entity: string, normalizer = ''): string => {
  return `${JsonLdNormalizer}${entity}*${normalizer}`;
};

declare global {
  interface InjectionTokensContractMap {
    [JsonLdNormalizer]: JsonLdNormalizer;
  }
}
