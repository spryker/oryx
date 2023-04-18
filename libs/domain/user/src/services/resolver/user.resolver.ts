import {
  BaseResolver,
  ResolvedToken,
  Resolver,
  TokenResourceResolvers,
} from '@spryker-oryx/core';
import { Provider, resolve } from '@spryker-oryx/di';
import { map } from 'rxjs';
import { UserService } from '..';

export type UserResolvers = {
  NAME: Resolver;
};

export class UserResolver extends BaseResolver<UserResolvers> {
  protected user$ = resolve(UserService).getUser();

  protected resolvers: UserResolvers = {
    // TODO: drop hardcoded fallback string
    NAME: (): ResolvedToken =>
      this.user$.pipe(map((user) => user?.firstName ?? 'login')),
  };
}

export const UserResourceResolver: Provider = {
  provide: `${TokenResourceResolvers}USER`,
  useClass: UserResolver,
};
