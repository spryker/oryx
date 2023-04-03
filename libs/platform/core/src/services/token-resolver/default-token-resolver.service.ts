import { resolve } from '@spryker-oryx/di';
import { of } from 'rxjs';
import {
  ResolvedToken,
  TokenResolver,
  TokenResourceResolver,
  TokenResourceResolvers,
} from './token-resolver.service';

const tokenRE = /^[A-Z]+\.[A-Z]+$/;

export class DefaultTokenService implements TokenResolver {
  protected resolvers = new Map<string, TokenResourceResolver>();

  protected isToken(resolver: string): boolean {
    return tokenRE.test(resolver);
  }

  protected getResolverKey(resourceResolver: string): string {
    return `${TokenResourceResolvers}${resourceResolver}`;
  }

  protected getResolver(resourceResolver: string): TokenResourceResolver {
    const key = this.getResolverKey(resourceResolver);
    if (!this.resolvers.has(key)) {
      this.resolvers.set(key, resolve(key));
    }

    return this.resolvers.get(key)!;
  }

  resolveToken(token: string): ResolvedToken {
    if (!this.isToken(token)) {
      return of(token);
    }

    const [resourceResolver, resolver] = token.split('.');

    return this.getResolver(resourceResolver).resolve(resolver);
  }
}
