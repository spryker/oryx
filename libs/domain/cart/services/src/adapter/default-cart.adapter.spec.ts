import { AuthIdentity, IdentityService } from '@spryker-oryx/auth';
import {
  ApiCartModel,
  CartAdapter,
  CartNormalizer,
  CartsNormalizer,
} from '@spryker-oryx/cart';
import { mockGetCartsResponse } from '@spryker-oryx/cart/mocks';
import { HttpService, JsonAPITransformerService } from '@spryker-oryx/core';
import { HttpTestService } from '@spryker-oryx/core/testing';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import {
  CurrencyService,
  PriceModeService,
  Store,
  StoreService,
} from '@spryker-oryx/site';
import { Observable, of } from 'rxjs';
import { DefaultCartAdapter } from './default-cart.adapter';

const mockApiUrl = 'mockApiUrl';

const mockAnonymousUser: AuthIdentity = {
  userId: 'userId',
  isAuthenticated: false,
};

const mockUser: AuthIdentity = {
  userId: 'userId',
  isAuthenticated: true,
};

const mockTransformer = {
  do: vi.fn().mockReturnValue(() => of(null)),
  transform: vi.fn(),
};

class MockIdentityService implements Partial<IdentityService> {
  get = vi
    .fn<[], Observable<AuthIdentity>>()
    .mockReturnValue(of(mockAnonymousUser));
}

class MockStoreService implements Partial<StoreService> {
  get = vi
    .fn<[], Observable<Store>>()
    .mockReturnValue(of({ id: 'DE' } as Store));
}

class MockCurrencyService implements Partial<CurrencyService> {
  get = vi.fn<[], Observable<string>>().mockReturnValue(of('EUR'));
}

class MockPriceModeService implements Partial<PriceModeService> {
  get = vi.fn<[], Observable<string>>().mockReturnValue(of('GROSS_MODE'));
}

describe('DefaultCartAdapter', () => {
  let adapter: CartAdapter;
  let identity: MockIdentityService;
  let http: HttpTestService;
  let storeService: MockStoreService;
  let currencyService: MockCurrencyService;
  let priceModeService: MockPriceModeService;

  function requestIncludes(isAuthenticated = false): string {
    return `?include=${(isAuthenticated
      ? [ApiCartModel.Includes.Items, ApiCartModel.Includes.Coupons]
      : [ApiCartModel.Includes.GuestCartItems, ApiCartModel.Includes.Coupons]
    ).join(',')}`;
  }

  beforeEach(() => {
    const testInjector = createInjector({
      providers: [
        {
          provide: HttpService,
          useClass: HttpTestService,
        },
        {
          provide: CartAdapter,
          useClass: DefaultCartAdapter,
        },
        {
          provide: 'SCOS_BASE_URL',
          useValue: mockApiUrl,
        },
        {
          provide: JsonAPITransformerService,
          useValue: mockTransformer,
        },
        {
          provide: IdentityService,
          useClass: MockIdentityService,
        },
        {
          provide: StoreService,
          useClass: MockStoreService,
        },
        {
          provide: CurrencyService,
          useClass: MockCurrencyService,
        },
        {
          provide: PriceModeService,
          useClass: MockPriceModeService,
        },
      ],
    });

    adapter = testInjector.inject(CartAdapter);
    http = testInjector.inject<HttpTestService>(HttpService);
    identity = testInjector.inject<MockIdentityService>(IdentityService);
    storeService = testInjector.inject<MockStoreService>(StoreService);
    currencyService = testInjector.inject<MockCurrencyService>(CurrencyService);
    priceModeService =
      testInjector.inject<MockPriceModeService>(PriceModeService);
    http.flush(mockGetCartsResponse);
  });

  afterEach(() => {
    vi.clearAllMocks();
    destroyInjector();
  });

  it('should be provided', () => {
    expect(adapter).toBeInstanceOf(DefaultCartAdapter);
  });

  describe('getAll should send `get` request', () => {
    beforeEach(() => {
      http.flush(mockGetCartsResponse);
    });

    describe('guest user', () => {
      it('should build url', () => {
        adapter.getAll().subscribe();

        expect(http.url).toBe(`${mockApiUrl}/guest-carts${requestIncludes()}`);
      });
    });

    describe('loggedIn user', () => {
      beforeEach(() => {
        identity.get.mockReturnValue(of(mockUser));
      });

      it('should build url', async () => {
        adapter.getAll().subscribe();

        expect(http.url).toBe(
          `${mockApiUrl}/customers/${mockUser.userId}/carts${requestIncludes(
            true
          )}`
        );
      });
    });

    describe('data transforming', () => {
      it('should call transformer with proper normalizer', () => {
        adapter.getAll().subscribe();

        expect(mockTransformer.do).toHaveBeenCalledWith(CartsNormalizer);
      });

      it('should return transformed data', () => {
        const mockTransformerData = 'mockTransformerData';
        const callback = vi.fn();
        mockTransformer.do.mockReturnValue(() => of(mockTransformerData));

        adapter.getAll().subscribe(callback);

        expect(callback).toHaveBeenCalledWith(mockTransformerData);
      });
    });
  });

  describe('get should send `get` request', () => {
    const mockGuestGetCartQualifier = {
      cartId: 'test',
    };
    const mockGetCartQualifier = {
      ...mockGuestGetCartQualifier,
    };

    describe('guest user', () => {
      it('should build url', () => {
        adapter.get(mockGuestGetCartQualifier).subscribe();

        expect(http.url).toBe(
          `${mockApiUrl}/guest-carts/${
            mockGuestGetCartQualifier.cartId
          }${requestIncludes()}`
        );
      });
    });

    describe('loggedIn user', () => {
      beforeEach(() => {
        identity.get.mockReturnValue(of(mockUser));
      });

      it('should build url', () => {
        adapter.get(mockGetCartQualifier).subscribe();

        expect(http.url).toBe(
          `${mockApiUrl}/carts/${mockGetCartQualifier.cartId}${requestIncludes(
            true
          )}`
        );
      });
    });

    describe('data transforming', () => {
      it('should call transformer data with proper normalizer', () => {
        adapter.get(mockGuestGetCartQualifier).subscribe();

        expect(mockTransformer.do).toHaveBeenCalledWith(CartNormalizer);
      });

      it('should return transformed data', () => {
        const mockTransformerData = 'mockTransformerData';
        const callback = vi.fn();
        mockTransformer.do.mockReturnValue(() => of(mockTransformerData));

        adapter.get(mockGuestGetCartQualifier).subscribe(callback);

        expect(callback).toHaveBeenCalledWith(mockTransformerData);
      });
    });
  });

  describe('addEntry should send `post` request', () => {
    const mockGuestAddEntryQualifier = {
      cartId: 'test',
      sku: 'sku',
      quantity: 1,
    };
    const mockAddEntryQualifier = {
      ...mockGuestAddEntryQualifier,
    };

    describe('guest user', () => {
      it('should build url', () => {
        adapter.addEntry(mockGuestAddEntryQualifier).subscribe();

        expect(http.url).toBe(
          `${mockApiUrl}/guest-carts/${
            mockGuestAddEntryQualifier.cartId
          }/guest-cart-items${requestIncludes()}`
        );
      });

      it('should provide body', () => {
        adapter.addEntry(mockGuestAddEntryQualifier).subscribe();

        expect(http.body).toEqual({
          data: {
            type: 'guest-cart-items',
            attributes: {
              sku: mockGuestAddEntryQualifier.sku,
              quantity: mockGuestAddEntryQualifier.quantity,
            },
          },
        });
      });
    });

    describe('loggedIn user', () => {
      beforeEach(() => {
        identity.get.mockReturnValue(of(mockUser));
      });

      it('should build url', () => {
        adapter.addEntry(mockAddEntryQualifier).subscribe();

        expect(http.url).toBe(
          `${mockApiUrl}/carts/${
            mockAddEntryQualifier.cartId
          }/items${requestIncludes(true)}`
        );
      });

      it('should provide body', () => {
        adapter.addEntry(mockAddEntryQualifier).subscribe();

        expect(http.body).toEqual({
          data: {
            type: 'items',
            attributes: {
              sku: mockAddEntryQualifier.sku,
              quantity: mockAddEntryQualifier.quantity,
            },
          },
        });
      });
    });

    describe('transforming data', () => {
      it('should call transformer with proper normalizer', () => {
        adapter.addEntry(mockGuestAddEntryQualifier).subscribe();

        expect(mockTransformer.do).toHaveBeenCalledWith(CartNormalizer);
      });

      it('should return transformed data', () => {
        const mockTransformerData = 'mockTransformerData';
        const callback = vi.fn();
        mockTransformer.do.mockReturnValue(() => of(mockTransformerData));

        adapter.addEntry(mockGuestAddEntryQualifier).subscribe(callback);

        expect(callback).toHaveBeenCalledWith(mockTransformerData);
      });
    });
  });

  describe('updateEntry should send `patch` request', () => {
    const mockGuestUpdateEntryQualifier = {
      cartId: 'test',
      groupKey: 'groupKey',
      sku: 'sku',
      quantity: 1,
    };
    const mockUpdateEntryQualifier = {
      ...mockGuestUpdateEntryQualifier,
    };

    describe('guest user', () => {
      it('should build url', () => {
        adapter.updateEntry(mockGuestUpdateEntryQualifier).subscribe();

        expect(http.url).toBe(
          `${mockApiUrl}/guest-carts/${
            mockGuestUpdateEntryQualifier.cartId
          }/guest-cart-items/${
            mockGuestUpdateEntryQualifier.groupKey
          }${requestIncludes()}`
        );
      });

      it('should provide body', () => {
        adapter.updateEntry(mockGuestUpdateEntryQualifier).subscribe();

        expect(http.body).toEqual({
          data: {
            type: 'guest-cart-items',
            attributes: {
              quantity: mockGuestUpdateEntryQualifier.quantity,
            },
          },
        });
      });
    });

    describe('loggedIn user', () => {
      beforeEach(() => {
        identity.get.mockReturnValue(of(mockUser));
      });

      it('should build url', () => {
        adapter.updateEntry(mockUpdateEntryQualifier).subscribe();

        expect(http.url).toBe(
          `${mockApiUrl}/carts/${mockUpdateEntryQualifier.cartId}/items/${
            mockUpdateEntryQualifier.groupKey
          }${requestIncludes(true)}`
        );
      });

      it('should provide body', () => {
        adapter.updateEntry(mockUpdateEntryQualifier).subscribe();

        expect(http.body).toEqual({
          data: {
            type: 'items',
            attributes: { quantity: mockUpdateEntryQualifier.quantity },
          },
        });
      });
    });

    describe('transforming data', () => {
      it('should call transformer with proper normalizer', () => {
        adapter.addEntry(mockUpdateEntryQualifier).subscribe();

        expect(mockTransformer.do).toHaveBeenCalledWith(CartNormalizer);
      });

      it('should return transformed data', () => {
        const mockTransformerData = 'mockTransformerData';
        const callback = vi.fn();
        mockTransformer.do.mockReturnValue(() => of(mockTransformerData));

        adapter.addEntry(mockUpdateEntryQualifier).subscribe(callback);

        expect(callback).toHaveBeenCalledWith(mockTransformerData);
      });
    });
  });

  describe('deleteEntry should send `delete` request', () => {
    const mockGuestDeleteEntryQualifier = {
      cartId: 'test',
      groupKey: 'groupKey',
    };
    const mockDeleteEntryQualifier = {
      ...mockGuestDeleteEntryQualifier,
    };

    beforeEach(() => {
      http.flush(null);
    });

    describe('guest user', () => {
      it('should build url', () => {
        adapter.deleteEntry(mockGuestDeleteEntryQualifier).subscribe();

        expect(http.url).toBe(
          `${mockApiUrl}/guest-carts/${
            mockGuestDeleteEntryQualifier.cartId
          }/guest-cart-items/${
            mockGuestDeleteEntryQualifier.groupKey
          }${requestIncludes()}`
        );
      });
    });

    describe('loggedIn user', () => {
      beforeEach(() => {
        identity.get.mockReturnValue(of(mockUser));
      });

      it('should build url', () => {
        adapter.deleteEntry(mockDeleteEntryQualifier).subscribe();

        expect(http.url).toBe(
          `${mockApiUrl}/carts/${mockDeleteEntryQualifier.cartId}/items/${
            mockDeleteEntryQualifier.groupKey
          }${requestIncludes(true)}`
        );
      });
    });

    it('should do emission', () => {
      const callback = vi.fn();

      adapter.deleteEntry(mockDeleteEntryQualifier).subscribe(callback);

      expect(callback).toHaveBeenCalled();
    });
  });

  describe('addEntry should create cart if needed for registered user', () => {
    beforeEach(() => {
      identity.get.mockReturnValue(of(mockUser));
    });

    it('should create cart if cartId is undefined', () => {
      const mockRegisteredAddEntryQualifier = {
        cartId: undefined,
        sku: 'sku',
        quantity: 1,
      };

      const mockResponse = { id: 'newCartId' };
      const callback = vi.fn();

      http.flush(mockResponse);
      mockTransformer.do.mockReturnValue((x: any) => x);

      adapter.addEntry(mockRegisteredAddEntryQualifier).subscribe(callback);

      expect(http.urls).toStrictEqual([
        `${mockApiUrl}/carts`,
        `${mockApiUrl}/carts/newCartId/items?include=items,vouchers`,
      ]);

      http.flush(mockResponse);

      expect(callback).toHaveBeenCalledWith(mockResponse);
    });

    it('should not create cart if cartId is defined', () => {
      const mockRegisteredAddEntryQualifier = {
        cartId: 'testCartId',
        sku: 'sku',
        quantity: 1,
      };

      const mockResponse = { id: 'existingCartId' };
      const callback = vi.fn();

      http.flush(mockResponse);
      mockTransformer.do.mockReturnValue((x: any) => x);

      adapter.addEntry(mockRegisteredAddEntryQualifier).subscribe(callback);

      expect(http.url).toBe(
        `${mockApiUrl}/carts/${
          mockRegisteredAddEntryQualifier.cartId
        }/items${requestIncludes(true)}`
      );

      expect(http.urls).toStrictEqual([
        `${mockApiUrl}/carts/testCartId/items?include=items,vouchers`,
      ]);
      expect(callback).toHaveBeenCalledWith(mockResponse);
    });
  });

  describe('create', () => {
    const qualifier = {
      name: 'test',
    };

    beforeEach(() => {
      http.flush(null);
      vi.spyOn(http, 'post');
      adapter.create(qualifier).subscribe();
    });

    it('should get the store', () => {
      expect(storeService.get).toHaveBeenCalled();
    });

    it('should get the currency', () => {
      expect(currencyService.get).toHaveBeenCalled();
    });

    it('should get the price mode', () => {
      expect(priceModeService.get).toHaveBeenCalled();
    });

    it('should make a post request', () => {
      expect(http.post).toHaveBeenCalledWith(`${mockApiUrl}/carts`, {
        data: {
          type: 'carts',
          attributes: {
            name: qualifier.name,
            priceMode: 'GROSS_MODE',
            currency: 'EUR',
            store: 'DE',
          },
        },
      });
    });

    it('should normalize the response', () => {
      expect(mockTransformer.do).toHaveBeenCalledWith(CartNormalizer);
    });

    describe('when qualifier is not provided', () => {
      beforeEach(() => {
        adapter.create().subscribe();
      });

      it('should not provide the name', () => {
        expect(http.post).toHaveBeenCalledWith(`${mockApiUrl}/carts`, {
          data: {
            type: 'carts',
            attributes: {
              priceMode: 'GROSS_MODE',
              currency: 'EUR',
              store: 'DE',
            },
          },
        });
      });
    });
  });

  describe('delete', () => {
    const qualifier = {
      cartId: 'test',
    };

    beforeEach(() => {
      http.flush(null);
      vi.spyOn(http, 'delete');
      adapter.delete(qualifier).subscribe();
    });

    it('should make a delete request', () => {
      expect(http.delete).toHaveBeenCalledWith(
        `${mockApiUrl}/carts/${qualifier.cartId}`
      );
    });

    it('should normalize the response', () => {
      expect(mockTransformer.do).toHaveBeenCalledWith(CartNormalizer);
    });
  });
});
