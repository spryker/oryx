import {
  defaultSortingQualifier,
  PickingList,
  PickingListQualifier,
  PickingListQualifierSortBy,
  PickingListService,
  SortableQualifier,
} from '@spryker-oryx/picking';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { mockPickingListData } from './mock-picking-list';

export class MockPickingListService implements Partial<PickingListService> {
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

  get(qualifier?: PickingListQualifier): Observable<PickingList[]> {
    const { ids: qIds, status: qStatus } = qualifier ?? {};
    const filteredData = mockPickingListData.filter(({ id, status }) => {
      return qIds?.includes(id) && (!qStatus || status === qStatus);
    });
    return of(filteredData);
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
