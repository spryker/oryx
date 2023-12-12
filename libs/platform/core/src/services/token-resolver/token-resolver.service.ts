import { LitElement } from 'lit';
import { DirectiveResult } from 'lit/directive';
import { Observable } from 'rxjs';

/** @deprecated since 1.2 use Observable<ResolvedResult> instead */
export type ResolvedToken = Observable<
  DirectiveResult | string | boolean | null
>;
export type ResolvedResult = DirectiveResult | string | boolean | null;

export type Resolver = (
  options?: TokenResolverOptions
) => Observable<ResolvedResult>;

export interface TokenResolver {
  resolveToken(
    token: string,
    options?: TokenResolverOptions
  ): Observable<ResolvedResult>;
}

export interface TokenResourceResolver {
  resolve(
    resolver: string,
    options?: TokenResolverOptions
  ): Observable<ResolvedResult>;
}

export interface TokenResolverOptions {
  contextElement?: HTMLElement | LitElement;
}

export const TokenResolver = 'oryx.TokenResolver';
export const TokenResourceResolvers = 'oryx.TokenResourceResolvers*';

declare global {
  interface InjectionTokensContractMap {
    [TokenResolver]: TokenResolver;
  }
}
