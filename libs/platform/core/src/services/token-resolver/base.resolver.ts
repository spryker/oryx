import {
  ResolvedResult,
  Resolver,
  TokenResolverOptions,
  TokenResourceResolver,
} from '@spryker-oryx/core';
import { Observable, of } from 'rxjs';

export class BaseResolver<T extends Record<string, Resolver>>
  implements TokenResourceResolver
{
  protected resolvers: T = {} as T;

  resolve(
    resolver: string,
    options?: TokenResolverOptions
  ): Observable<ResolvedResult> {
    if (!(resolver in this.resolvers)) {
      console.warn(`Resolver ${resolver} is not supported`);
      return of(resolver);
    }
    return this.resolvers[resolver as keyof T](options);
  }
}
