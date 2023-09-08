import { ApiUserModel, RegistrationService } from '@spryker-oryx/user';
import { Observable, of } from 'rxjs';

export class MockRegistrationService implements RegistrationService {
  register(data: ApiUserModel.CreateUser): Observable<unknown> {
    return of(null);
  }
}
