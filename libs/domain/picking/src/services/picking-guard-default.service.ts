import { BehaviorSubject, Observable } from 'rxjs';
import { PickingGuardService } from './picking-guard.service';

export class PickingGuardDefaultService implements PickingGuardService {
  protected guard$ = new BehaviorSubject(false);

  guard(): void {
    this.guard$.next(true);
  }

  isProtected(): Observable<boolean> {
    return this.guard$;
  }

  allow(): void {
    this.guard$.next(false);
  }
}
