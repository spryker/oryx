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
  /** @deprecated since 1.4. Use TokenResolverConfig instead of string token */
  resolveToken(token: string): Observable<ResolvedResult>;
  resolveToken(options: TokenResolverConfig): Observable<ResolvedResult>;
}

export interface TokenResourceResolver {
  /** @deprecated since 1.4. Use ResourceResolverConfig instead of string*/
  resolve(resolver: string): Observable<ResolvedResult>;
  resolve(options: ResourceResolverConfig): Observable<ResolvedResult>;
}

export interface TokenResolverConfig extends TokenResolverOptions {
  /**
   * String token for the resources resolving
   */
  token: string;
}

export interface ResourceResolverConfig extends TokenResolverOptions {
  resolver: string;
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
