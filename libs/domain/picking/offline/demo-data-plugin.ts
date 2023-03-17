import {
  AppEnvironment,
  ExecPlugin,
  InjectionPlugin,
} from '@spryker-oryx/core';
import { DexieIndexedDbService } from '@spryker-oryx/indexed-db';
import { ItemsFilters, PickingListStatus } from '@spryker-oryx/picking';
import { Transaction } from 'dexie';
import {
  PickingListEntity,
  PickingListSerialized,
  PickingProductEntity,
} from './entities';

export class OfflineDemoDataPlugin extends ExecPlugin {
  constructor() {
    super((app) => {
      const injector = app!.requirePlugin(InjectionPlugin).getInjector();

      const env = injector.inject(AppEnvironment, {} as AppEnvironment);

      // TODO - re-enable this check when online features are added to orchestration. We'd like to display something in netlify for the time being.
      /*
      if (!env.DEV) {
        return;
      }
      */

      const dexieIdbService = injector.inject(DexieIndexedDbService);

      dexieIdbService.onPopulate((tx) => this.populateDb(tx, dexieIdbService));
    });
  }

  protected async populateDb(
    tx: Transaction,
    dexieIdbService: DexieIndexedDbService
  ): Promise<void> {
    const mockPickingLists: PickingListSerialized[] = [
      {
        id: 'picking-list-1',
        status: PickingListStatus.ReadyForPicking,
        createdAt: new Date(),
        updatedAt: new Date(),
        cartNote: 'Mock cart note',
        items: [
          {
            numberOfPicked: 0,
            numberOfNotPicked: 0,
            quantity: 5,
            productId: 'product-1',
            orderItem: {
              amount: '5',
              quantity: 5,
              idSalesOrderItem: 1,
              name: 'Mock order 1',
              sku: 'sku-1',
              uuid: 'order-1',
            },
            status: ItemsFilters.NotPicked,
          },
          {
            numberOfPicked: 0,
            numberOfNotPicked: 0,
            quantity: 3,
            productId: 'product-2',
            orderItem: {
              amount: '5',
              idSalesOrderItem: 1,
              name: 'Mock order 1',
              quantity: 3,
              sku: 'sku-2',
              uuid: 'order-1',
            },
            status: ItemsFilters.NotPicked,
          },
        ],
        itemsCount: 1,
        localStatus: PickingListStatus.ReadyForPicking,
        orderReferences: ['order-1'],
        productSkus: ['product-1', 'product-2'],
        requestedDeliveryDate: new Date(),
      },
      {
        id: 'picking-list-2',
        status: PickingListStatus.ReadyForPicking,
        createdAt: new Date(),
        updatedAt: new Date(),
        items: [
          {
            numberOfPicked: 0,
            numberOfNotPicked: 0,
            quantity: 1,
            productId: 'product-3',
            orderItem: {
              amount: '2',
              quantity: 2,
              idSalesOrderItem: 2,
              name: 'Mock order 2',
              sku: 'sku-2',
              uuid: 'order-2',
            },
            status: ItemsFilters.NotPicked,
          },
          {
            numberOfPicked: 0,
            numberOfNotPicked: 0,
            quantity: 7,
            productId: 'product-5',
            orderItem: {
              amount: '7',
              quantity: 7,
              idSalesOrderItem: 2,
              name: 'Mock order 2',
              sku: 'sku-2',
              uuid: 'order-2',
            },
            status: ItemsFilters.NotPicked,
          },
          {
            numberOfPicked: 0,
            numberOfNotPicked: 0,
            quantity: 3,
            productId: 'product-1',
            orderItem: {
              amount: '3',
              quantity: 3,
              idSalesOrderItem: 2,
              name: 'Mock order 2',
              sku: 'sku-2',
              uuid: 'order-2',
            },
            status: ItemsFilters.NotPicked,
          },
        ],
        itemsCount: 1,
        localStatus: PickingListStatus.ReadyForPicking,
        orderReferences: ['order-2'],
        productSkus: ['product-3', 'product-5', 'product-1'],
        requestedDeliveryDate: new Date(),
      },
      {
        id: 'picking-list-3',
        status: PickingListStatus.PickingStarted,
        createdAt: new Date(),
        updatedAt: new Date(),
        items: [
          {
            numberOfPicked: 0,
            numberOfNotPicked: 0,
            quantity: 5,
            productId: 'product-1',
            orderItem: {
              amount: '5',
              quantity: 5,
              idSalesOrderItem: 1,
              name: 'Mock order 1',
              sku: 'sku-1',
              uuid: 'order-1',
            },
            status: ItemsFilters.NotPicked,
          },
          {
            numberOfPicked: 0,
            numberOfNotPicked: 0,
            quantity: 3,
            productId: 'product-2',
            orderItem: {
              amount: '5',
              idSalesOrderItem: 1,
              name: 'Mock order 1',
              quantity: 3,
              sku: 'sku-2',
              uuid: 'order-1',
            },
            status: ItemsFilters.NotPicked,
          },
        ],
        itemsCount: 1,
        localStatus: PickingListStatus.PickingStarted,
        orderReferences: ['order-1'],
        productSkus: ['product-1', 'product-2'],
        requestedDeliveryDate: new Date(),
      },
    ];
    const mockProducts: PickingProductEntity[] = [
      {
        id: 'product-1',
        sku: 'sku-1',
        productName: 'Mock product #1',
        image:
          'https://images.icecat.biz/img/gallery_mediums/img_24425591_medium_1483525296_3275_9985.jpg',
        imageLarge: 'https://images.icecat.biz/img/norm/high/24425591-5275.jpg',
      },
      {
        id: 'product-2',
        sku: 'sku-2',
        productName: 'Mock product #2',
        image: 'https://images.icecat.biz/img/norm/medium/26138343-5454.jpg',
        imageLarge: 'https://images.icecat.biz/img/norm/high/26138343-5454.jpg',
      },
      {
        id: 'product-3',
        sku: 'sku-3',
        productName: 'Mock product #3',
        image: null,
        imageLarge: null,
      },
      {
        id: 'product-4',
        sku: 'sku-4',
        productName: 'Mock product #4',
        image: null,
        imageLarge: null,
      },
      {
        id: 'product-5',
        sku: 'sku-5',
        productName: 'Mock product #5',
        image: null,
        imageLarge: null,
      },
    ];

    const pickingListTable = tx.table<PickingListSerialized>(
      dexieIdbService.getStoreName(PickingListEntity)
    );
    const productTable = tx.table<PickingProductEntity>(
      dexieIdbService.getStoreName(PickingProductEntity)
    );

    await pickingListTable.bulkAdd(mockPickingLists);
    await productTable.bulkAdd(mockProducts);
  }
}
