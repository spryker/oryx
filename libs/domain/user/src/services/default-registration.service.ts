import { resolve } from '@spryker-oryx/di';
import { ApiUserModel } from '@spryker-oryx/user';
import { Observable } from 'rxjs';
import { RegistrationAdapter } from './adapter/registration.adapter';
import { RegistrationService } from './registration.service';

export class DefaultRegistrationService implements RegistrationService {
  constructor(protected adapter = resolve(RegistrationAdapter)) {}

  register(data: ApiUserModel.CreateUser): Observable<unknown> {
    return this.adapter.register({ ...data, confirmPassword: data.password });
  }
}
