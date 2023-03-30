import { Observable } from 'rxjs';

export interface TokenResolver {
  resolve(resolver: string): Observable<string | null>;
}

export type ResolversResult = Observable<string | null>;
export type Resolver = (...args: string[]) => ResolversResult;

export interface TokenResolverService {
  resolve(token: string): Observable<string | null>;
}

export const TokenResolverService = 'oryx.TokenResolverService';

declare global {
  interface InjectionTokensContractMap {
    [TokenResolverService]: TokenResolverService;
  }
}
