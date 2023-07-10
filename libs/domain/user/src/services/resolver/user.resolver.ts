import {
  BaseResolver,
  ResolvedToken,
  Resolver,
  TokenResourceResolvers,
} from '@spryker-oryx/core';
import { Provider, resolve } from '@spryker-oryx/di';
import { i18n } from '@spryker-oryx/utilities';
import { map } from 'rxjs';
import { UserService } from '..';

export type UserResolvers = {
  NAME: Resolver;
  AUTHENTICATED: Resolver;
};

export class UserResolver extends BaseResolver<UserResolvers> {
  protected user$ = resolve(UserService).getUser();

  protected resolvers: UserResolvers = {
    // TODO: drop hardcoded fallback string
    NAME: (): ResolvedToken =>
      this.user$.pipe(map((user) => user?.firstName ?? i18n('auth.login'))),
    AUTHENTICATED: (): ResolvedToken => this.user$.pipe(map((user) => !!user)),
  };
}

export const UserResourceResolver: Provider = {
  provide: `${TokenResourceResolvers}USER`,
  useClass: UserResolver,
};
