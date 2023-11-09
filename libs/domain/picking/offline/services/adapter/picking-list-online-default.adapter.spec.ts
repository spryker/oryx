import { HttpTestService } from '@spryker-oryx/core/testing';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { IndexedDbService } from '@spryker-oryx/indexed-db';
import {
  ItemsFilters,
  PickingHttpService,
  PickingListDefaultAdapter,
  PickingListStatus,
} from '@spryker-oryx/picking/api';
import { mockPickingListData } from '@spryker-oryx/picking/mocks';
import { nextTick } from '@spryker-oryx/utilities';
import { Table } from 'dexie';
import { of } from 'rxjs';
import { PickingListEntity } from '../../entities';
import { PickingListOnlineDefaultAdapter } from './picking-list-online-default.adapter';
import { PickingListOnlineAdapter } from './picking-list-online.adapter';

const mockPickingListEntity = new PickingListEntity({
  ...mockPickingListData[0],
  itemsCount: 1,
  productSkus: [],
  requestedDeliveryDate: new Date(),
  localStatus: PickingListStatus.ReadyForPicking,
  items: [],
});

const mockPickingListDataResponse = {
  data: [
    {
      attributes: {
        id: 'mock-id',
        uuid: 'mock-uuid',
        status: 'mock-status',
        pickingListItems: [
          {
            id: 'mock-item-id',
            concreteProducts: [
              {
                id: 'mock-product-id',
                sku: 'mock-sku',
                name: 'mock-name',
                concreteProductImageSets: [
                  {
                    imageSets: [
                      {
                        images: [
                          { externalUrlSmall: '', externalUrlLarge: '' },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
            orderItem: { uuid: 'mock-order-uuid' },
            salesShipments: [{ requestedDeliveryDate: 123 }],
            salesOrders: [
              { cartNote: 'mock-note', orderReference: 'mockOrderReference' },
            ],
            quantity: 1,
          },
        ],
        createdAt: '',
        updatedAt: '',
      },
    },
  ],
  included: [{ pickingListItems: [] }],
  links: { self: 'mocklink' },
};

class MockIndexedDbService implements Partial<IndexedDbService> {
  getStore = vi.fn().mockImplementation(() => of(mockTable));
}

class MockTable implements Partial<Table> {
  bulkGet = vi.fn().mockReturnValue(new Promise((resolve) => resolve([])));
}

const mockTable = new MockTable();

describe('PickingListOnlineAdapter', () => {
  let adapter: PickingListOnlineAdapter;
  let indexeddb: MockIndexedDbService;
  let http: HttpTestService;

  beforeEach(() => {
    const testInjector = createInjector({
      providers: [
        {
          provide: PickingListOnlineAdapter,
          useClass: PickingListOnlineDefaultAdapter,
        },
        {
          provide: IndexedDbService,
          useClass: MockIndexedDbService,
        },
        {
          provide: PickingHttpService,
          useClass: HttpTestService,
        },
      ],
    });
    adapter = testInjector.inject(PickingListOnlineAdapter);
    indexeddb = testInjector.inject(
      IndexedDbService
    ) as unknown as MockIndexedDbService;
    http = testInjector.inject(
      PickingHttpService
    ) as unknown as HttpTestService;

    http.flush(mockPickingListDataResponse);
  });

  afterEach(() => {
    vi.clearAllMocks();
    destroyInjector();
  });

  it('should be provided', () => {
    expect(adapter).toBeInstanceOf(PickingListOnlineDefaultAdapter);
  });

  describe('when get is called', () => {
    const callback = vi.fn();
    const spy = vi.spyOn(PickingListDefaultAdapter.prototype, 'get');
    beforeEach(() => {
      adapter.get({}).subscribe(callback);
    });
    it('should parse picking lists', async () => {
      await nextTick(7);

      expect(callback).toHaveBeenCalledWith([
        expect.objectContaining({
          items: [
            {
              id: 'mock-item-id',
              orderItem: { uuid: 'mock-order-uuid' },
              type: 'picking-list-items',
              status: ItemsFilters.NotPicked,
              productId: 'mock-product-id',
              quantity: 1,
            },
          ],
          itemsCount: 1,
          orderReferences: ['mockOrderReference'],
          requestedDeliveryDate: new Date(123),
          localStatus: 'mock-status',
          productSkus: ['mock-sku'],
        }),
      ]);
      expect(indexeddb.getStore).toHaveBeenCalledWith(PickingListEntity);
      expect(mockTable.bulkGet).toHaveBeenCalledWith(['mock-id']);
    });

    it('should call super', () => {
      expect(spy).toHaveBeenCalledWith({});
    });
  });

  describe('when startPicking is called', () => {
    it('should call super', () => {
      const spy = vi.spyOn(PickingListDefaultAdapter.prototype, 'startPicking');
      adapter.startPicking(mockPickingListEntity).subscribe();

      expect(spy).toHaveBeenCalledWith(mockPickingListEntity);
    });
  });

  describe('when updatePickingItems is called', () => {
    it('should call super', () => {
      const spy = vi.spyOn(
        PickingListDefaultAdapter.prototype,
        'updatePickingItems'
      );
      adapter.updatePickingItems(mockPickingListEntity).subscribe();

      expect(spy).toHaveBeenCalledWith(mockPickingListEntity);
    });
  });

  describe('when finishPicking is called', () => {
    it('should call super', () => {
      const spy = vi.spyOn(
        PickingListDefaultAdapter.prototype,
        'finishPicking'
      );
      adapter.finishPicking(mockPickingListEntity).subscribe();

      expect(spy).toHaveBeenCalledWith(mockPickingListEntity);
    });
  });
});
