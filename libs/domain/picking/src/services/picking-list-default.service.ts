import { inject } from '@spryker-oryx/di';
import {
  BehaviorSubject,
  catchError,
  Observable,
  of,
  switchMap,
  tap,
} from 'rxjs';
import {
  PickingList,
  PickingListQualifier,
  PickingListQualifierSortBy,
  SortableQualifier,
} from '../models';
import { PickingListAdapter } from './adapter';
import { PickingListService } from './picking-list.service';

export class PickingListDefaultService implements PickingListService {
  protected upcomingPickingListId$ = new BehaviorSubject<string | null>(null);

  constructor(
    protected adapter = inject(PickingListAdapter),
    protected defaultSortingQualifier = {
      sortBy: PickingListQualifierSortBy.RequestedDeliveryDate,
      sortDesc: false,
    }
  ) {}

  protected sortingQualifier$ =
    new BehaviorSubject<SortableQualifier<PickingListQualifierSortBy> | null>(
      null
    );

  getSortingQualifier(): Observable<SortableQualifier<PickingListQualifierSortBy> | null> {
    return this.sortingQualifier$;
  }

  setSortingQualifier(
    qualifier: SortableQualifier<PickingListQualifierSortBy>
  ): void {
    this.sortingQualifier$.next(qualifier);
  }

  get(qualifier: PickingListQualifier): Observable<PickingList[]> {
    return this.sortingQualifier$.pipe(
      switchMap((sortingQualifier) =>
        this.adapter.get({
          ...qualifier,
          ...(sortingQualifier || this.defaultSortingQualifier),
        })
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
