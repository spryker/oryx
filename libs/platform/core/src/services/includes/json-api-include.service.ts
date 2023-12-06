import { Observable } from 'rxjs';

export type IncludeDefinition = string | { include: string; fields: string[] };

export const JsonApiIncludeService = 'oryx.includesService';

export const IncludesToken = 'oryx.includes-';

export interface IncludesQualifier {
  resource: string;
  includes?: IncludeDefinition[];
}

export interface JsonApiIncludeService {
  get(qualifier: IncludesQualifier): Observable<string>;
}

declare global {
  interface InjectionTokensContractMap {
    [JsonApiIncludeService]: JsonApiIncludeService;
  }
}
