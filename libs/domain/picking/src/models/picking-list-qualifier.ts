import { PageableQualifier } from './pageable-qualifier';
import { PickingListStatus } from './picking-list';
import { SortableQualifier } from './sortable-qualifier';

export interface PickingListQualifier
  extends SortableQualifier<PickingListQualifierSortBy>,
    PageableQualifier {
  id?: string;
  status?: PickingListStatus;
  orderReferences?: string[];
}

export enum PickingListQualifierSortBy {
  DeliveryDate = 'deliveryDate',
  OrderSize = 'orderSize',
}

export const defaultSortingQualifier = {
  sortBy: PickingListQualifierSortBy.DeliveryDate,
  sortDesc: true,
};
