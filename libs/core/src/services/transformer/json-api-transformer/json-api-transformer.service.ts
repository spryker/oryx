import { Observable } from 'rxjs';
export const JsonAPITransformerService = 'FES.JsonAPITransformerService';

export interface JsonAPITransformerService {
  transform<T, D = unknown>(
    data: D,
    token: keyof InjectionTokensContractMap
  ): Observable<T>;
}

declare global {
  interface InjectionTokensContractMap {
    [JsonAPITransformerService]: JsonAPITransformerService;
  }
}
