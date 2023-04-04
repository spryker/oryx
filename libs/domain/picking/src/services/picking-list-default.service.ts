import { inject } from '@spryker-oryx/di';
import { Observable } from 'rxjs';
import { PickingList, PickingListQualifier } from '../models';
import { PickingListAdapter } from './adapter';
import { PickingListService } from './picking-list.service';

export class PickingListDefaultService implements PickingListService {
  constructor(protected adapter = inject(PickingListAdapter)) {}

  get(qualifier: PickingListQualifier): Observable<PickingList[]> {
    return this.adapter.get(qualifier);
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
