import { resolve } from '@spryker-oryx/di';
import { of } from 'rxjs';
import {
  ResolvedToken,
  TokenResolver,
  TokenResourceResolver,
  TokenResourceResolvers,
} from './token-resolver.service';

const tokenRE = /^[A-Z_-]+\.[A-Z_-]+$/;

export class DefaultTokenService implements TokenResolver {
  protected resolvers = new Map<string, TokenResourceResolver>();

  protected isToken(resolver: string): boolean {
    return tokenRE.test(resolver);
  }

  protected getResolverKey(resourceResolver: string): string {
    return `${TokenResourceResolvers}${resourceResolver}`;
  }

  protected getResolver(resourceResolver: string): TokenResourceResolver | undefined {
    const key = this.getResolverKey(resourceResolver);
    if (!this.resolvers.has(key)) {
      try {
        const resolver = resolve(key);
        this.resolvers.set(key, resolver);
      } catch {
        //is handled in injector
      }
    }

    return this.resolvers.get(key)
  }

  resolveToken(token: string): ResolvedToken {
    if (!this.isToken(token)) {
      return of(token);
    }

    const [resourceResolver, resolver] = token.split('.');
    const tokenResolver = this.getResolver(resourceResolver);

    //if it is not possible to resolve the token -> return the token as result
    return tokenResolver ? tokenResolver.resolve(resolver) : of(token);
  }
}
