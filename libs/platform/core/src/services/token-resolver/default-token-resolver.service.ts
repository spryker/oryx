import { resolve } from '@spryker-oryx/di';
import { map, of, skip, startWith } from 'rxjs';
import {
  ResolvedToken,
  TokenResolver,
  TokenResourceResolver,
  TokenResourceResolvers,
} from './token-resolver.service';

const tokenRE = /^[A-Z_-]+\.(!?)[A-Z_-]+$/;

export class DefaultTokenService implements TokenResolver {
  protected resolvers = new Map<string, TokenResourceResolver>();

  resolveToken(token: string): ResolvedToken {
    if (!this.isToken(token)) {
      return of(token);
    }

    const [resourceResolver, rawResolver] = token.split('.');
    const isNegative = this.isNegative(rawResolver);
    const resolver = rawResolver.slice(isNegative ? 1 : 0);
    const tokenResolver = this.getResolver(resourceResolver);

    //if it is not possible to resolve the token -> return the token as result
    if (!tokenResolver) {
      return of(token);
    }

    return tokenResolver.resolve(resolver).pipe(
      startWith(null),
      skip(1),
      map(
        //reverse the value of negative token if needed
        (resolvedValue) => (isNegative ? !resolvedValue : resolvedValue)
      )
    );
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
        const resolver = resolve(key);
        this.resolvers.set(key, resolver);
      } catch {
        //is handled in injector
      }
    }

    return this.resolvers.get(key);
  }
}
