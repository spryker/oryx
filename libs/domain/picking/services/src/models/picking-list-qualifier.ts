import { PickingListStatus } from './picking-list';

export interface SearchQualifier {
  searchOrderReference?: string;
}

export interface PageableQualifier {
  limit?: number;
  offset?: number;
}

export interface SortableQualifier<SortBy extends string> {
  sortBy?: SortBy;
  sortDesc?: boolean;
}

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
