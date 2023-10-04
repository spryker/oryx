import { HttpService, JsonAPITransformerService } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import { Observable, switchMap } from 'rxjs';
import { ApiUserModel, User } from '../../models';
import { UserNormalizer } from './normalizers';
import { RegistrationAdapter } from './registration.adapter';
import { UserSerializer } from './serializers';

export class DefaultRegistrationAdapter implements RegistrationAdapter {
  constructor(
    protected SCOS_BASE_URL = inject('SCOS_BASE_URL'),
    protected httpService = inject(HttpService),
    protected transformer = inject(JsonAPITransformerService)
  ) {}

  register(data: User): Observable<ApiUserModel.User> {
    return this.transformer
      .serialize(data, UserSerializer)
      .pipe(
        switchMap((serializedData) =>
          this.httpService
            .post(`${this.SCOS_BASE_URL}/customers`, serializedData)
            .pipe(this.transformer.do(UserNormalizer))
        )
      );
  }
}
