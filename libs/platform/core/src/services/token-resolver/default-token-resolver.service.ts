import { INJECTOR, Injector, inject, resolve } from '@spryker-oryx/di';
import { featureVersion } from '@spryker-oryx/utilities';
import { map, of } from 'rxjs';
import {
  ResolvedToken,
  TokenResolver,
  TokenResourceResolver,
  TokenResourceResolvers,
} from './token-resolver.service';

const tokenRE = /^[A-Z_-]+\.(!?)[A-Z_-]+$/;

export class DefaultTokenService implements TokenResolver {
  protected resolvers = new Map<string, TokenResourceResolver>();
  protected injector?: Injector;

  constructor() {
    if (featureVersion >= '1.1') {
      this.injector = inject(INJECTOR);
    }
  }

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
        const resolver =
          featureVersion >= '1.1'
            ? // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              this.injector!.inject<TokenResourceResolver>(key)
            : resolve(key);
        this.resolvers.set(key, resolver);
      } catch {
        //is handled in injector
      }
    }

    return this.resolvers.get(key);
  }
}
