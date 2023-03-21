import { inject } from '@spryker-oryx/di';
import { BehaviorSubject, map, Observable, shareReplay, switchMap } from 'rxjs';
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
