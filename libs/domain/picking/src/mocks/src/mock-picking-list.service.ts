import {
  PickingList,
  PickingListQualifier,
  PickingListService,
} from '@spryker-oryx/picking';
import { Observable, of } from 'rxjs';
import { mockPickingListData } from './mock-picking-list';

export class MockPickingListService implements Partial<PickingListService> {
  get(qualifier?: PickingListQualifier): Observable<PickingList[]> {
    const { id: qId, status: qStatus } = qualifier ?? {};
    const filteredData = mockPickingListData.filter(({ id, status }) => {
      return (!qId || id === qId) && (!qStatus || status === qStatus);
    });
    return of(filteredData);
  }

  getById(id: string): Observable<PickingList | null> {
    const list = mockPickingListData.find((list) => id === list.id);
    return of(list ?? null);
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
}
