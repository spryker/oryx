import {
  defaultQualifier,
  PickingList,
  PickingListQualifier,
  PickingListService,
} from '@spryker-oryx/picking/services';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { mockPickingListData } from './mock-picking-list';

export class MockPickingListService implements Partial<PickingListService> {
  protected isEmpty = false;

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

  protected searchQualifier$ = new BehaviorSubject<string>('');

  getQualifier(): Observable<PickingListQualifier> {
    return this.qualifier$;
  }

  setQualifier(qualifier: PickingListQualifier): void {
    this._qualifier = { ...this._qualifier, ...qualifier };
    this.qualifier$.next(this._qualifier);
  }

  setEmptyList(value: boolean): void {
    this.isEmpty = value;
  }

  get(): Observable<PickingList[]> {
    if (this.isEmpty) {
      return of([]);
    }
    const { ids: qIds, status: qStatus } = this._qualifier ?? {};
    const filteredData = mockPickingListData.filter(({ id, status }) => {
      return (!qIds || qIds?.includes(id)) && (!qStatus || status === qStatus);
    });
    return of(filteredData);
  }

  getList(_id: string): Observable<PickingList | null> {
    const list = mockPickingListData.find(({ id }) => id === _id) ?? null;
    return of(list);
  }

  startPicking(pickingList: PickingList): Observable<PickingList> {
    return of(pickingList);
  }

  updatePickingItems(pickingList: PickingList): Observable<PickingList> {
    return of(pickingList);
  }

  finishPicking(pickingList: PickingList): Observable<PickingList> {
    return of(pickingList);
  }

  getUpcomingPickingListId(): Observable<string | null> {
    return of(null);
  }
}
