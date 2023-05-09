import { Observable } from 'rxjs';
import {
  PickingList,
  PickingListError,
  PickingListQualifier,
} from '../../models';

export interface PickingListAdapter {
  get(qualifier?: PickingListQualifier): Observable<PickingList[]>;
  startPicking(pickingList: PickingList): Observable<PickingList>;
  updatePickingItems(pickingList: PickingList): Observable<PickingList>;
  finishPicking(pickingList: PickingList): Observable<PickingList>;
}

export const PickingListAdapter = 'oryx.PickingListAdapter';

declare global {
  interface InjectionTokensContractMap {
    [PickingListAdapter]: PickingListAdapter;
  }
}
