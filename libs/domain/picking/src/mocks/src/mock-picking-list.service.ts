import {
  PickingList,
  PickingListQualifier,
  PickingListService,
} from '@spryker-oryx/picking';
import { Observable, of } from 'rxjs';
import { mockPickingListData } from './mock-picking-list';

export class MockPickingListService implements Partial<PickingListService> {
  get(): Observable<PickingList[]> {
    return of(mockPickingListData);
  }

  getById(pickingListId: string): Observable<PickingList | null> {
    const pickingList = mockPickingListData.find(
      ({ id }) => pickingListId === id
    );

    return of(pickingList ?? null);
  }

  setQualifier(
    qualifier: PickingListQualifier
  ): Observable<PickingListQualifier> {
    return of(qualifier);
  }

  getUpcomingPickingListId(): Observable<string | null> {
    return of(null);
  }
}
