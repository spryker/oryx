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
    const filteredData = mockPickingListData.filter(({id, status}) => {
      return (!qId || id === qId) && (!qStatus || status === qStatus)
    })
    return of(filteredData);
  }
}
