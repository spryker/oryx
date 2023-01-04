import { Identity, IdentityService } from '@spryker-oryx/auth';
import { Observable, of } from 'rxjs';

export class MockIdentityService implements Partial<IdentityService> {
  get(): Observable<Identity> {
    return of({ id: 'id', anonymous: true });
  }
}
