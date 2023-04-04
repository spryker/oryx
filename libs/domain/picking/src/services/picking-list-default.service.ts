import { inject } from '@spryker-oryx/di';
import {
  BehaviorSubject,
  catchError,
  map,
  Observable,
  of,
  shareReplay,
  switchMap,
  tap,
} from 'rxjs';
import { PickingList, PickingListQualifier } from '../models';
import { PickingListAdapter } from './adapter';
import { PickingListService } from './picking-list.service';

export class PickingListDefaultService implements PickingListService {
  protected pickingListsQualifier$ = new BehaviorSubject<PickingListQualifier>(
    {}
  );

  protected pickingLists$ = this.pickingListsQualifier$.pipe(
    switchMap((qualifier) => this.adapter.get(qualifier)),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  protected upcomingPickingListId$ = new BehaviorSubject<string | null>(null);

  constructor(protected adapter = inject(PickingListAdapter)) {}

  setQualifier(
    qualifier: PickingListQualifier
  ): Observable<PickingListQualifier> {
    this.pickingListsQualifier$.next(qualifier);

    return this.pickingListsQualifier$;
  }

  get(): Observable<PickingList[]> {
    return this.pickingLists$;
  }

  getById(pickingListId: string): Observable<PickingList | null> {
    return this.pickingLists$.pipe(
      map(
        (pickingList) =>
          pickingList?.find(({ id }) => id === pickingListId) ?? null
      )
    );
  }

  startPicking(pickingList: PickingList): Observable<PickingList | null> {
    this.upcomingPickingListId$.next(pickingList.id);
    return this.adapter.startPicking(pickingList).pipe(
      catchError(() => {
        this.upcomingPickingListId$.next(null);
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
