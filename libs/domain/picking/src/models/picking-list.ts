import { PickingProduct } from './picking-product';

export interface PickingList {
  id: string;
  orderReferences: string[];
  requestedDeliveryDate: Date;
  status: PickingListStatus;
  items: PickingListItem[];
  cartNote?: string;
  createdAt: Date;
  updatedAt: Date;
  itemsCount: number;
}

export interface PickingListError extends Error {
  code: string;
  status: number;
}

export enum ItemsFilters {
  NotPicked = 'not_picked',
  Picked = 'picked',
  NotFound = 'not_found',
}

export enum PickingListStatus {
  ReadyForPicking = 'ready-for-picking',
  PickingStarted = 'picking-started',
  PickingFinished = 'picking-finished',
}

export enum FallbackType {
  noResults = 'no-orders',
  noSearchingResults = 'no-search-results',
  noValueProvided = 'searching',
}

export interface PickingListItem {
  id: string;
  quantity: number;
  numberOfPicked: number;
  numberOfNotPicked: number;
  orderItem: PickingOrderItem;
  product: PickingProduct;
  status: ItemsFilters;
}

export interface PickingOrderItem {
  idSalesOrderItem: number;
  uuid: string;
  name: string;
  sku: string;
  quantity: number;
  amount: string;
  amountSalesUnit?: PickingAmountSalesUnit;
}

export interface PickingAmountSalesUnit {
  conversion: number;
  precision: number;
  productMeasurementUnit: PickingMeasurementUnit;
}

export interface PickingMeasurementUnit {
  name: string;
  code: string;
}

export interface SummaryInfo {
  main: string;
  additional?: string;
}

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
