import { Observable } from 'rxjs';

export interface TokenResolver {
  resolve(resolver: string): Observable<string | null>;
}

export type ResolvedToken = Observable<string | null>;
export type Resolver = (...args: string[]) => ResolvedToken;

export interface TokenResolverService {
  resolve(token: string): Observable<string | null>;
}

export const TokenResolverService = 'oryx.TokenResolverService';
export const TokenResourceResolver = 'oryx.TokenResolver*';

declare global {
  interface InjectionTokensContractMap {
    [TokenResolverService]: TokenResolverService;
  }
}
