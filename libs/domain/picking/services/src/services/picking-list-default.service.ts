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
import { defaultQualifier, PickingList, PickingListQualifier } from '../models';
import { PickingListAdapter } from './adapter';
import { PickingListService } from './picking-list.service';

export class PickingListDefaultService implements PickingListService {
  constructor(protected adapter = inject(PickingListAdapter)) {}

  protected upcomingPickingListId$ = new BehaviorSubject<string | null>(null);
  protected allowDiscardPicking$ = new BehaviorSubject<boolean>(true);

  protected activeSearch$ = new BehaviorSubject<boolean>(false);

  isActiveSearch(): Observable<boolean> {
    return this.activeSearch$;
  }

  toggleActiveSearch(state: boolean): void {
    this.activeSearch$.next(state);
  }

  protected _qualifier: PickingListQualifier = defaultQualifier;
  protected qualifier$ = new BehaviorSubject<PickingListQualifier>(
    this._qualifier
  );

  getQualifier(): Observable<PickingListQualifier> {
    return this.qualifier$;
  }

  setQualifier(qualifier: PickingListQualifier): void {
    this._qualifier = { ...this._qualifier, ...qualifier };
    this.qualifier$.next(this._qualifier);
  }

  get(): Observable<PickingList[]> {
    return this.qualifier$.pipe(
      switchMap((qualifier) => this.adapter.get(qualifier))
    );
  }

  getList(id: string): Observable<PickingList | null> {
    return this.adapter.get({ ids: [id] }).pipe(map((list) => list[0] ?? null));
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
