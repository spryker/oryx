import { BehaviorSubject, Observable, Subject, take, tap } from 'rxjs';
import { PickingHeaderService } from './picking-header.service';

export class PickingHeaderDefaultService implements PickingHeaderService {
  protected showDialog$ = new BehaviorSubject(false);
  protected modalResult$ = new Subject<boolean>();

  guardWithDialog(): Observable<boolean> {
    this.showDialog$.next(true);
    return this.modalResult$.pipe(
      take(1),
      tap(() => {
        this.showDialog$.next(false);
      })
    );
  }

  discard(): void {
    this.modalResult$.next(true);
  }

  cancel(): void {
    this.modalResult$.next(false);
  }

  showDialog(): Observable<boolean> {
    return this.showDialog$;
  }
}
