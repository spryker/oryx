import { inject } from '@spryker-oryx/di';
import { BehaviorSubject, catchError, Observable, of, tap } from 'rxjs';
import { PickingList, PickingListQualifier } from '../models';
import { PickingListAdapter } from './adapter';
import { PickingListService } from './picking-list.service';

export class PickingListDefaultService implements PickingListService {
  protected upcomingPickingListId$ = new BehaviorSubject<string | null>(null);

  constructor(protected adapter = inject(PickingListAdapter)) {}

  get(qualifier: PickingListQualifier): Observable<PickingList[]> {
    return this.adapter.get(qualifier);
  }

  startPicking(pickingList: PickingList): Observable<PickingList | null> {
    this.upcomingPickingListId$.next(pickingList.id);
    return this.adapter.startPicking(pickingList).pipe(
      catchError((e) => {
        this.upcomingPickingListId$.next(null);
        throw e;
        return of(null);
      }),
      tap(() => this.upcomingPickingListId$.next(null))
    );
  }

  getUpcomingPickingListId(): Observable<string | null> {
    return this.upcomingPickingListId$;
  }

  updatePickingItems(pickingList: PickingList): Observable<PickingList> {
    return this.adapter.updatePickingItems(pickingList);
  }

  finishPicking(pickingList: PickingList): Observable<PickingList> {
    return this.adapter.finishPicking(pickingList);
  }
}
