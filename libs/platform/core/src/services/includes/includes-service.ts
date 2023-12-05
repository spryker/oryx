import { Observable } from 'rxjs';

export type IncludeDefinition = string | { include: string; fields: string[] };

export const IncludesService = 'oryx.includesService';

export const IncludesToken = 'oryx.includes-';

export interface IncludesQualifier {
  entity: string;
  includes?: IncludeDefinition[];
}

export interface IncludesService {
  get(qualifier: IncludesQualifier): Observable<string>;
}

declare global {
  interface InjectionTokensContractMap {
    [IncludesService]: IncludesService;
  }
}
