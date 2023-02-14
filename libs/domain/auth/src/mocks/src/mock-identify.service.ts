import { Identity, IdentityService } from '@spryker-oryx/auth';
import { BehaviorSubject, Observable } from 'rxjs';

export class MockIdentityService implements Partial<IdentityService> {
  protected identity$ = new BehaviorSubject<Identity>({
    id: 'id',
    anonymous: true,
  });

  get(): Observable<Identity> {
    return this.identity$;
  }

  set(identity: Identity): void {
    this.identity$.next(identity);
  }
}
