import { INJECTOR, inject, resolve } from '@spryker-oryx/di';
import { featureVersion } from '@spryker-oryx/utilities';
import { combineLatest, map, of } from 'rxjs';
import {
  ResolvedToken,
  TokenResolver,
  TokenResourceResolver,
  TokenResourceResolvers,
} from './token-resolver.service';

const tokenRE = /^[A-Z_-]+\.(!?)[A-Z_-]+$/;
const conditionalTokenRE = /\|\|/;

export class DefaultTokenService implements TokenResolver {
  protected resolvers = new Map<string, TokenResourceResolver>();
  protected injector = inject(INJECTOR);

  resolveToken(token: string): ResolvedToken {
    if (this.isConditionalToken(token)) {
      return this.resolveConditionalToken(token);
    }
    
    if (!this.isToken(token)) {
      return of(token);
    }

    return this.resolveSimpleToken(token);
  }

  protected resolveConditionalToken(token: string): ResolvedToken {
    const tokens = token.split('||').map((token) => token.trim());

    const invalidTokens = tokens.filter(
      (token) => !this.isToken(token) || !this.getResolver(token.split('.')[0])
    );
    invalidTokens.forEach((token) => this.warnInvalidToken(token));

    const tokensToResolve = tokens.filter(
      (token) => !invalidTokens.includes(token)
    );

    if (!tokensToResolve.length) {
      return of(false);
    }

    const resolvedTokens = tokensToResolve.map((token) =>
      this.resolveToken(token)
    );

    return combineLatest(resolvedTokens).pipe(
      map((resolvedTokens) => resolvedTokens.some((token) => token))
    );
  }

  protected resolveSimpleToken(token: string): ResolvedToken {
    const [resourceResolver, rawResolver] = token.split('.');
    const isNegative = this.isNegative(rawResolver);
    const resolver = rawResolver.slice(isNegative ? 1 : 0);
    const tokenResolver = this.getResolver(resourceResolver);

    if (!tokenResolver) {
      this.warnInvalidToken(token);
      return of(token);
    }

    return tokenResolver
      .resolve(resolver)
      .pipe(
        map((resolvedValue) => (isNegative ? !resolvedValue : resolvedValue))
      );
  }

  protected warnInvalidToken(token: string): void {
    console.error(`DefaultTokenResolver: Invalid token "${token}"`);
  }

  protected isConditionalToken(token: string): boolean {
    return conditionalTokenRE.test(token);
  }
  protected isToken(resolver: string): boolean {
    return tokenRE.test(resolver);
  }

  protected isNegative(resolver: string): boolean {
    return resolver.indexOf('!') === 0;
  }

  protected getResolverKey(resourceResolver: string): string {
    return `${TokenResourceResolvers}${resourceResolver}`;
  }

  protected getResolver(
    resourceResolver: string
  ): TokenResourceResolver | undefined {
    const key = this.getResolverKey(resourceResolver);
    if (!this.resolvers.has(key)) {
      try {
        const resolver =
          featureVersion >= '1.1'
            ? this.injector.inject<TokenResourceResolver>(key)
            : resolve(key);
        this.resolvers.set(key, resolver);
      } catch {
        //is handled in injector
      }
    }

    return this.resolvers.get(key);
  }
}
