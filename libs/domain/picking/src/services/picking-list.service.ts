import { Observable } from 'rxjs';
import { PickingList, PickingListQualifier } from '../models';

export interface PickingListService {
  get(): Observable<PickingList[]>;
  setQualifier(
    qualifier: PickingListQualifier
  ): Observable<PickingListQualifier>;
  getById(id: string): Observable<PickingList | null>;
  startPicking(pickingList: PickingList): Observable<PickingList | null>;
  isStartPickingLoading(pickingListId: string): Observable<boolean>;
  updatePickingItems(pickingList: PickingList): Observable<PickingList>;
  finishPicking(pickingList: PickingList): Observable<PickingList>;
}

export const PickingListService = 'oryx.PickingListService';

declare global {
  export interface InjectionTokensContractMap {
    [PickingListService]: PickingListService;
  }
}
