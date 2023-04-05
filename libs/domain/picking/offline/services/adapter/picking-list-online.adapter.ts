import {
  PickingListAdapter,
  PickingListQualifier,
} from '@spryker-oryx/picking';
import { Observable } from 'rxjs';
import { PickingListEntity } from '../../entities';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface PickingListOnlineAdapter extends PickingListAdapter {
  get(qualifier?: PickingListQualifier): Observable<PickingListEntity[]>;
  startPicking(pickingList: PickingListEntity): Observable<PickingListEntity>;
  updatePickingItems(
    pickingList: PickingListEntity
  ): Observable<PickingListEntity>;
  finishPicking(pickingList: PickingListEntity): Observable<PickingListEntity>;
}

export const PickingListOnlineAdapter = 'oryx.PickingListOnlineAdapter';

declare global {
  interface InjectionTokensContractMap {
    [PickingListOnlineAdapter]: PickingListOnlineAdapter;
  }
}
