import { Observable } from 'rxjs';

export type ResolvedToken<T = string> = Observable<T | null>;
export type Resolver<T = string> = () => ResolvedToken<T>;

export interface TokenResolver {
  resolveToken(token: string): ResolvedToken;
  resolveData<T>(token: string): ResolvedToken<T>;
}

export interface TokenResourceResolver {
  resolve<T>(resolver: string): ResolvedToken<T>;
}

export const TokenResolver = 'oryx.TokenResolver';
export const TokenResourceResolvers = 'oryx.TokenResourceResolvers*';

declare global {
  interface InjectionTokensContractMap {
    [TokenResolver]: TokenResolver;
  }
}
