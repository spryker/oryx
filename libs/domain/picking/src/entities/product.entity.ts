import {
  indexedDbEntity,
  indexedDbIndex,
  indexedDbPrimaryKey,
} from '@spryker-oryx/indexed-db';
import { Table } from 'dexie';
import { PickingProduct } from '../models';
import { RestorableEntity } from './restorable.entity';

declare global {
  interface OryxDexieDb {
    'oryx.products': Table<ProductEntity>;
  }
}

@indexedDbEntity({ storeName: 'oryx.products' })
export class ProductEntity extends RestorableEntity implements PickingProduct {
  @indexedDbPrimaryKey({ autoIncrement: true })
  declare id: string;
  @indexedDbIndex()
  declare sku: string;
  declare image: string | null;
  declare imageLarge: string | null;
  @indexedDbIndex()
  declare productName: string;
}
