import {
  defaultSortingQualifier,
  PickingList,
  PickingListQualifier,
  PickingListQualifierSortBy,
  PickingListService,
  SortableQualifier,
} from '@spryker-oryx/picking/services';
import { BehaviorSubject, map, Observable, of } from 'rxjs';
import { mockPickingListData } from './mock-picking-list';

export class MockPickingListService implements Partial<PickingListService> {
  protected sortingQualifier$ = new BehaviorSubject<
    SortableQualifier<PickingListQualifierSortBy>
  >(defaultSortingQualifier);
  protected isEmpty = false;

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

  setEmptyList(value: boolean): void {
    this.isEmpty = value;
  }

  get(qualifier?: PickingListQualifier): Observable<PickingList[]> {
    if (this.isEmpty) {
      return of([]);
    }
    const { ids: qIds, status: qStatus } = qualifier ?? {};
    const filteredData = mockPickingListData.filter(({ id, status }) => {
      return (!qIds || qIds?.includes(id)) && (!qStatus || status === qStatus);
    });
    return of(filteredData);
  }

  getList(id: string): Observable<PickingList | null> {
    return this.get({ ids: [id] }).pipe(map((list) => list[0] ?? null));
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
