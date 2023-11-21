import { BehaviorSubject, Observable, filter, of } from 'rxjs';
import { PickingGuardService } from './picking-guard.service';

export class PickingGuardDefaultService implements PickingGuardService {
  protected guard$ = new BehaviorSubject(false);

  guard(): Observable<void> {
    this.guard$.next(true);
    return of();
  }

  isProtected(): Observable<boolean> {
    return this.guard$;
  }

  allow(): Observable<void> {
    this.guard$.next(false);
    return of();
  }
}
