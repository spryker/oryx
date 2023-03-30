import { resolve } from '@spryker-oryx/di';
import { UserService } from '@spryker-oryx/user';
import { map, Observable, of } from 'rxjs';
import {
  Resolver,
  ResolversResult,
  TokenResolver,
} from '../token-resolver.service';

interface UserResolvers {
  NAME: Resolver;
}

export class UserResolver implements TokenResolver {
  protected user$ = resolve(UserService).getUser();

  protected resolvers: UserResolvers = {
    // TODO: drop hardcoded fallback string
    NAME: (): ResolversResult =>
      this.user$.pipe(map((user) => user?.firstName ?? 'login')),
  };

  resolve(resolver: string): Observable<string | null> {
    if (!(resolver in this.resolvers)) {
      return of(null);
    }
    return this.resolvers[resolver as keyof UserResolvers]();
  }
}
