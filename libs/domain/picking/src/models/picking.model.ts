import { ItemsFilters, PickingListItem } from '@spryker-oryx/picking/services';

export interface PickingTab {
  id: ItemsFilters;
  title: string;
  items: PickingListItem[];
}

export interface PartialPicking {
  productId: string;
  currentNumberOfPicked?: number;
  quantity?: number;
}

export enum FallbackType {
  noResults = 'no-orders',
  noSearchingResults = 'no-search-results',
  noValueProvided = 'searching',
}
