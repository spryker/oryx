import {
  BaseResolver,
  ResolvedToken,
  Resolver,
  TokenResourceResolvers,
} from '@spryker-oryx/core';
import { Provider, resolve } from '@spryker-oryx/di';
import { RouterService } from '@spryker-oryx/router';
//import { AccountMenuLinks } from '@spryker-oryx/user';
import { map } from 'rxjs';

export type AccountResolvers = {
  IS_VALID_TAB: Resolver;
};

export class AccountResolver extends BaseResolver<AccountResolvers> {
  protected params$ = resolve(RouterService).currentParams();

  protected resolvers: AccountResolvers = {
    IS_VALID_TAB: (): ResolvedToken =>
      this.params$.pipe(
        map((params) => params?.tab === 'tab') //AccountMenuLinks.OVERVIEW)
      ),
  };
}

export const AccountResourceResolver: Provider = {
  provide: `${TokenResourceResolvers}ACCOUNT`,
  useClass: AccountResolver,
};
