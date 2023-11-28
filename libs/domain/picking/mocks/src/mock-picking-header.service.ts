import { PickingGuardService } from '@spryker-oryx/picking';
import { Observable, of } from 'rxjs';

export class MockPickingGuardService implements PickingGuardService {
  guard(): Observable<void> {
    return of();
  }

  allow(): Observable<void> {
    return of();
  }

  isProtected(): Observable<boolean> {
    return of(false);
  }
}
