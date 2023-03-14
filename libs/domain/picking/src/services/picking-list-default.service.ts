import { inject } from '@spryker-oryx/di';
import {
  BehaviorSubject,
  map,
  Observable,
  shareReplay,
  switchMap,
  tap,
  using,
} from 'rxjs';
import {
  PickingList,
  PickingListQualifier,
  PickingListStatus,
} from '../models';
import { PickingListAdapter } from './adapter';
import { PickingListService } from './picking-list.service';

export class PickingListDefaultService implements PickingListService {
  protected pickingListsQualifier$ =
    new BehaviorSubject<PickingListQualifier | null>(null);
  protected pickingListsState$ = new BehaviorSubject<PickingList[]>([]);

  protected pickingListsLoading$ = this.pickingListsQualifier$.pipe(
    switchMap((qualifier) =>
      this.adapter.get(
        qualifier ?? {
          status: PickingListStatus.ReadyForPicking,
        }
      )
    ),
    tap((pickingLists) => {
      this.pickingListsState$.next(pickingLists?.length ? pickingLists : []);
    })
  );

  protected pickingLists$ = using(
    () => this.pickingListsLoading$.subscribe(),
    () => this.pickingListsState$
  ).pipe(shareReplay({ bufferSize: 1, refCount: true }));

  constructor(protected adapter = inject(PickingListAdapter)) {}

  setQualifier(qualifier: PickingListQualifier): void {
    this.pickingListsQualifier$.next(qualifier);
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

  startPicking(pickingList: PickingList): Observable<PickingList> {
    return this.adapter.startPicking(pickingList);
  }

  updatePickingItems(pickingList: PickingList): Observable<PickingList> {
    return this.adapter.updatePickingItems(pickingList);
  }

  finishPicking(pickingList: PickingList): Observable<PickingList> {
    return this.adapter.finishPicking(pickingList);
  }
}
