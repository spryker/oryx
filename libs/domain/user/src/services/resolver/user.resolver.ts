import {
  ResolvedToken,
  Resolver,
  TokenResourceResolver,
  TokenResourceResolvers,
} from '@spryker-oryx/core';
import { Provider, resolve } from '@spryker-oryx/di';
import { map, of } from 'rxjs';
import { UserService } from '..';

interface UserResolvers {
  NAME: Resolver;
}

export class UserResolver implements TokenResourceResolver {
  protected user$ = resolve(UserService).getUser();

  protected resolvers: UserResolvers = {
    // TODO: drop hardcoded fallback string
    NAME: (): ResolvedToken =>
      this.user$.pipe(map((user) => user?.firstName ?? 'login')),
  };

  resolve(resolver: string): ResolvedToken {
    if (!(resolver in this.resolvers)) {
      return of(null);
    }
    return this.resolvers[resolver as keyof UserResolvers]();
  }
}

export const UserResourceResolver: Provider = {
  provide: `${TokenResourceResolvers}USER`,
  useClass: UserResolver,
};
