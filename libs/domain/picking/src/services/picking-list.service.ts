import { Observable } from 'rxjs';
import { PickingList, PickingListQualifier } from '../models';

export interface PickingListService {
  get(): Observable<PickingList[]>;
  setQualifier(qualifier: PickingListQualifier): void;
  getById(id: string): Observable<PickingList | null>;
  startPicking(pickingList: PickingList): Observable<PickingList>;
  updatePickingItems(pickingList: PickingList): Observable<PickingList>;
  finishPicking(pickingList: PickingList): Observable<PickingList>;
}

export const PickingListService = 'oryx.PickingListService';

declare global {
  export interface InjectionTokensContractMap {
    [PickingListService]: PickingListService;
  }
}
