import {
  ResolvedToken,
  Resolver,
  TokenResourceResolver,
} from '@spryker-oryx/core';
import { of } from 'rxjs';

export class BaseResolver<T extends Record<string, Resolver<unknown>>>
  implements TokenResourceResolver
{
  protected resolvers: T = {} as T;

  resolve<A = string>(resolver: string): ResolvedToken<A> {
    if (!(resolver in this.resolvers)) {
      console.warn(`Resolver ${resolver} is not supported`);
      //TODO: organize types and drop any
      return of(resolver as any);
    }
    return this.resolvers[resolver as keyof T]() as ResolvedToken<A>;
  }
}
