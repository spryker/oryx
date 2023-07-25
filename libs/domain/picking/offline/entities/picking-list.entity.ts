import {
  indexedDbEntity,
  indexedDbForeignKey,
  indexedDbIndex,
  indexedDbPrimaryKey,
} from '@spryker-oryx/indexed-db';
import {
  PickingList,
  PickingListItem,
  PickingListQualifierSortBy,
  PickingListStatus,
} from '@spryker-oryx/picking';
import { Type } from '@spryker-oryx/utilities';
import { Table } from 'dexie';
import { PickingProductEntity } from './picking-product.entity';

declare global {
  interface OryxDexieDb {
    'oryx.picking-lists': Table<PickingListSerialized>;
  }

  interface IndexedDbEntityMap {
    'oryx.picking-lists': {
      entity: typeof PickingListEntity;
      mapTo: Type<PickingListSerialized>;
    };
  }
}

@indexedDbEntity({ storeName: 'oryx.picking-lists' })
export class PickingListEntity implements PickingListOffline {
  @indexedDbPrimaryKey()
  declare id: string;
  @indexedDbIndex()
  declare status: PickingListStatus;
  @indexedDbForeignKey({
    key: 'items.productId',
    foreignEntity: PickingProductEntity,
    propPath: 'items.product',
  })
  declare items: PickingListItemOffline[];
  @indexedDbIndex()
  declare cartNote?: string;
  declare createdAt: Date;
  declare updatedAt: Date;
  @indexedDbIndex()
  declare itemsCount: number;
  @indexedDbIndex({ multiEntry: true })
  declare orderReferences: string[];
  @indexedDbIndex({ multiEntry: true })
  declare productSkus: string[];
  @indexedDbIndex()
  declare requestedDeliveryDate: Date;
  @indexedDbIndex()
  declare localStatus: PickingListStatus;

  constructor(data: PickingListOffline) {
    Object.assign(this, data);

    this.items = this.items.map((item) => {
      const newItem = { ...item };
      const productKey: keyof PickingListItemOffline = 'product';

      // Hide `product` prop so it's not stored in DB
      Object.defineProperty(newItem, productKey, { enumerable: false });

      return newItem;
    });
  }
}

export interface PickingListOffline extends PickingList {
  items: PickingListItemOffline[];
  productSkus: string[];
  localStatus: PickingListStatus;
}

export interface PickingListItemOffline extends PickingListItem {
  productId: string;
  product: PickingProductEntity;
}

export interface PickingListSerialized
  extends Omit<PickingListOffline, 'items'> {
  items: PickingListItemSerialized[];
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface PickingListItemSerialized
  extends Omit<PickingListItemOffline, 'product'> {}

export type MappedQualifier = PickingListQualifierSortBy;

export type QualifiersMapping = Record<
  MappedQualifier,
  keyof PickingListOffline
>;
