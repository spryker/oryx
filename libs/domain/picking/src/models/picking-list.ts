import { PickingProduct } from './picking-product';

export interface PickingList {
  id: string;
  status: PickingListStatus;
  items: PickingListItem[];
  cartNote?: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum PickingListStatus {
  ReadyForPicking = 'ready-for-picking',
  PickingStarted = 'picking-started',
  PickingFinished = 'picking-finished',
}

export interface PickingListItem {
  quantity: number;
  numberOfPicked: number;
  numberOfNotPicked: number;
  orderItem: PickingOrderItem;
  product: PickingProduct;
  status: ItemsFilters;
}

export enum ItemsFilters {
  NotPicked = 'not_picked',
  Picked = 'picked',
  NotFound = 'not_found',
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
