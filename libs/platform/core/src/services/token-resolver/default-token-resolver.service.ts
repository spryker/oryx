import { resolve } from '@spryker-oryx/di';
import { Observable, of } from 'rxjs';
import {
  TokenResolver,
  TokenResolverService,
  TokenResourceResolver,
} from './token-resolver.service';

const tokenRE = /^[A-Z]+\.[A-Z]+$/;

export class DefaultTokenResolverService implements TokenResolverService {
  protected resolvers = new Map<string, TokenResolver>();

  protected isToken(resolver: string): boolean {
    return tokenRE.test(resolver);
  }

  protected getResolverKey(tokenResolver: string): string {
    return `${TokenResourceResolver}${tokenResolver}`;
  }

  protected getResolver(tokenResolver: string): TokenResolver {
    const key = this.getResolverKey(tokenResolver);
    if (!this.resolvers.has(key)) {
      this.resolvers.set(key, resolve(key));
    }

    return this.resolvers.get(key)!;
  }

  resolve(token: string): Observable<string | null> {
    if (!this.isToken(token)) {
      return of(token);
    }

    const [tokenResolver, resolver] = token.split('.');

    return this.getResolver(tokenResolver).resolve(resolver);
  }
}
