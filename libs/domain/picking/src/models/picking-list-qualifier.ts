import { PageableQualifier } from './pageable-qualifier';
import { PickingListStatus } from './picking-list';
import { SearchQualifier } from './search-qualifier';
import { SortableQualifier } from './sortable-qualifier';

export interface PickingListQualifier
  extends SortableQualifier<PickingListQualifierSortBy>,
    PageableQualifier,
    SearchQualifier {
  ids?: string[];
  status?: PickingListStatus;
  orderReferences?: string[];
}

export enum PickingListQualifierSortBy {
  DeliveryDate = 'deliveryDate',
  OrderSize = 'orderSize',
}

export const defaultSortingQualifier = {
  sortBy: PickingListQualifierSortBy.DeliveryDate,
  sortDesc: false,
};
