import { Observable } from 'rxjs';

export type ResolvedToken = Observable<string | null>;
export type Resolver = (...args: string[]) => ResolvedToken;

export interface TokenResolver {
  resolveToken(token: string): ResolvedToken;
}

export interface TokenResourceResolver {
  resolve(resolver: string): ResolvedToken;
}

export const TokenResolver = 'oryx.TokenResolver';
export const TokenResourceResolver = 'oryx.TokenResourceResolver*';

declare global {
  interface InjectionTokensContractMap {
    [TokenResolver]: TokenResolver;
  }
}
