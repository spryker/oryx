import {
  ResolvedToken,
  Resolver,
  TokenResolver,
  TokenResourceResolver,
} from '@spryker-oryx/core';
import { Provider, resolve } from '@spryker-oryx/di';
import { UserService } from '..';
import { map, of } from 'rxjs';

interface UserResolvers {
  NAME: Resolver;
}

export class UserResolver implements TokenResolver {
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
  provide: `${TokenResourceResolver}USER`,
  useClass: UserResolver,
};
