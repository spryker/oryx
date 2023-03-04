import { IdentityService } from '@spryker-oryx/auth';
import { HttpService, JsonAPITransformerService } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import { ApiUserModel, User } from '@spryker-oryx/user';
import { Observable, switchMap, take } from 'rxjs';
import { UserNormalizer } from './normalizers/user';
import { UserAdapter } from './user.adapter';

export class DefaultUserAdapter implements UserAdapter {
  constructor(
    protected identityService = inject(IdentityService),
    protected SCOS_BASE_URL = inject('SCOS_BASE_URL'),
    protected transformer = inject(JsonAPITransformerService),
    protected httpService = inject(HttpService)
  ) {}

  get(): Observable<User> {
    return this.identityService.get().pipe(
      take(1),
      switchMap((identity) =>
        this.httpService.get<ApiUserModel.Response>(
          `${this.SCOS_BASE_URL}/customers/${identity.userId}`
        )
      ),
      this.transformer.do(UserNormalizer)
    );
  }
}
