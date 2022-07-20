import { Observable } from 'rxjs';

export const TransformerService = 'FES.TransformerService';

export interface TransformerService {
  transform<T, D = unknown>(
    data: D,
    token: keyof InjectionTokensContractMap
  ): Observable<T>;
}

export type Transformer<O = unknown, I = unknown> = (
  data: I,
  transformer: TransformerService
) => O | Observable<O>;

declare global {
  interface InjectionTokensContractMap {
    [TransformerService]: TransformerService;
  }
}
