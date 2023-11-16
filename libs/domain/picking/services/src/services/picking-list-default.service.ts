import { inject } from '@spryker-oryx/di';
import {
  BehaviorSubject,
  catchError,
  map,
  Observable,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
import {
  defaultSortingQualifier,
  PickingList,
  PickingListQualifier,
  PickingListQualifierSortBy,
  SortableQualifier,
} from '../models';
import { PickingListAdapter } from './adapter';
import { PickingListService } from './picking-list.service';

export class PickingListDefaultService implements PickingListService {
  protected upcomingPickingListId$ = new BehaviorSubject<string | null>(null);
  protected allowDiscardPicking$ = new BehaviorSubject<boolean>(true);

  constructor(protected adapter = inject(PickingListAdapter)) {}

  protected sortingQualifier$ = new BehaviorSubject<
    SortableQualifier<PickingListQualifierSortBy>
  >(defaultSortingQualifier);

  getSortingQualifier(): Observable<
    SortableQualifier<PickingListQualifierSortBy>
  > {
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
          ...sortingQualifier,
          ...qualifier,
        })
      )
    );
  }

  getList(id: string): Observable<PickingList> {
    return this.get({ ids: [id] }).pipe(map((list) => list[0] ?? null));
  }

  startPicking(pickingList: PickingList): Observable<PickingList | null> {
    this.upcomingPickingListId$.next(pickingList.id);
    return this.adapter.startPicking(pickingList).pipe(
      catchError((e) => {
        this.upcomingPickingListId$.next(null);
        return throwError(() => e);
      }),
      tap(() => {
        this.allowDiscardPicking$.next(false);
        this.upcomingPickingListId$.next(null);
      })
    );
  }

  getUpcomingPickingListId(): Observable<string | null> {
    return this.upcomingPickingListId$;
  }

  updatePickingItems(pickingList: PickingList): Observable<PickingList> {
    return this.adapter.updatePickingItems(pickingList);
  }

  finishPicking(pickingList: PickingList): Observable<PickingList> {
    return this.adapter
      .finishPicking(pickingList)
      .pipe(tap(() => this.allowDiscardPicking$.next(true)));
  }

  allowDiscardPicking(): Observable<boolean> {
    return this.allowDiscardPicking$;
  }
}
