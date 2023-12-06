import { Observable } from 'rxjs';
import { PickingList, PickingListQualifier } from '../models';

export interface PickingListService {
  get(): Observable<PickingList[]>;
  getList(id: string): Observable<PickingList | null>;
  startPicking(pickingList: PickingList): Observable<PickingList | null>;
  getUpcomingPickingListId(): Observable<string | null>;
  updatePickingItems(pickingList: PickingList): Observable<PickingList>;
  finishPicking(pickingList: PickingList): Observable<PickingList>;
  getQualifier(): Observable<PickingListQualifier>;
  setQualifier(qualifier: PickingListQualifier): void;
  allowDiscardPicking(): Observable<boolean>;
  isActiveSearch(): Observable<boolean>;
  toggleActiveSearch(state: boolean): void;
}

export const PickingListService = 'oryx.PickingListService';

declare global {
  export interface InjectionTokensContractMap {
    [PickingListService]: PickingListService;
  }
}
