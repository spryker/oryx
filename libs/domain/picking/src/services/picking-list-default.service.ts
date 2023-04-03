import { inject } from '@spryker-oryx/di';
import {
  BehaviorSubject,
  filter,
  map,
  Observable,
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

  protected isStartPickingLoading$ = new BehaviorSubject<string | null>(null);

  constructor(protected adapter = inject(PickingListAdapter)) {}

  protected setStartPickingLoading(pickingListId: string | null): void {
    this.isStartPickingLoading$.next(pickingListId);
  }

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
    return this.isStartPickingLoading(pickingList.id).pipe(
      filter((isLoading) => !isLoading),
      tap(() => this.setStartPickingLoading(pickingList.id)),
      switchMap(() => this.adapter.startPicking(pickingList)),
      tap(() => this.setStartPickingLoading(null))
    );
  }

  isStartPickingLoading(pickingListId: string): Observable<boolean> {
    return this.isStartPickingLoading$.pipe(
      map((loadingPickingListId) => loadingPickingListId === pickingListId)
    );
  }

  updatePickingItems(pickingList: PickingList): Observable<PickingList> {
    return this.adapter.updatePickingItems(pickingList);
  }

  finishPicking(pickingList: PickingList): Observable<PickingList> {
    return this.adapter.finishPicking(pickingList);
  }
}
