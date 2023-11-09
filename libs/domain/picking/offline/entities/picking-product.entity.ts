import {
  indexedDbEntity,
  indexedDbIndex,
  indexedDbPrimaryKey,
} from '@spryker-oryx/indexed-db';
import { PickingProduct } from '@spryker-oryx/picking/api';
import { Table } from 'dexie';

declare global {
  interface OryxDexieDb {
    'oryx.picking-products': Table<PickingProductEntity>;
  }
}

@indexedDbEntity({ storeName: 'oryx.picking-products' })
export class PickingProductEntity implements PickingProductOffline {
  @indexedDbPrimaryKey()
  declare id: string;
  @indexedDbIndex()
  declare sku: string;
  @indexedDbIndex()
  declare productName: string;
  declare image: string | null;
  declare imageLarge: string | null;

  constructor(data: PickingProductOffline) {
    Object.assign(this, data);
  }
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface PickingProductOffline extends PickingProduct {}
