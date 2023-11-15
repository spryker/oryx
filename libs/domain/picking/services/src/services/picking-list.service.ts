import { Observable } from 'rxjs';
import {
  PickingList,
  PickingListQualifier,
  PickingListQualifierSortBy,
  SortableQualifier,
} from '../models';

export interface PickingListService {
  get(qualifier: PickingListQualifier): Observable<PickingList[]>;
  getList(id: string): Observable<PickingList | null>;
  startPicking(pickingList: PickingList): Observable<PickingList | null>;
  getUpcomingPickingListId(): Observable<string | null>;
  updatePickingItems(pickingList: PickingList): Observable<PickingList>;
  finishPicking(pickingList: PickingList): Observable<PickingList>;
  getSortingQualifier(): Observable<
    SortableQualifier<PickingListQualifierSortBy>
  >;
  setSortingQualifier(
    qualifier: SortableQualifier<PickingListQualifierSortBy>
  ): void;
  allowDiscardPicking(): Observable<boolean>;
}

export const PickingListService = 'oryx.PickingListService';

declare global {
  export interface InjectionTokensContractMap {
    [PickingListService]: PickingListService;
  }
}
