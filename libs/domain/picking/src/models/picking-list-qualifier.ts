import { PageableQualifier } from './pageable-qualifier';
import { PickingListStatus } from './picking-list';
import { SortableQualifier } from './sortable-qualifier';

export interface PickingListQualifier
  extends SortableQualifier<PickingListQualifierSortBy>,
    PageableQualifier {
  id?: string;
  status?: PickingListStatus;
  orderItemUUIDs?: string[];
}

export enum PickingListQualifierSortBy {
  deliveryDate = 'deliveryDate',
}
