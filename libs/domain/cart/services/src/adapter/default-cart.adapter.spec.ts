import { AuthIdentity, IdentityService } from '@spryker-oryx/auth';
import { mockGetCartsResponse } from '@spryker-oryx/cart/mocks';
import { HttpService, JsonAPITransformerService } from '@spryker-oryx/core';
import { HttpTestService } from '@spryker-oryx/core/testing';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { CurrencyService, Store, StoreService } from '@spryker-oryx/site';
import { Observable, of } from 'rxjs';
import { ApiCartModel } from '../../models';
import { CartAdapter } from './cart.adapter';
import { DefaultCartAdapter } from './default-cart.adapter';
import { CartNormalizer, CartsNormalizer } from './normalizers';

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

describe('DefaultCartAdapter', () => {
  let service: CartAdapter;
  let identity: MockIdentityService;
  let http: HttpTestService;

  function requestIncludes(isAuthenticated = false): string {
    return `?include=${(isAuthenticated
      ? [ApiCartModel.Includes.Items]
      : [ApiCartModel.Includes.GuestCartItems]
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
      ],
    });

    service = testInjector.inject(CartAdapter);
    http = testInjector.inject(HttpService) as HttpTestService;
    identity = testInjector.inject(IdentityService) as MockIdentityService;
    http.flush(mockGetCartsResponse);
  });

  afterEach(() => {
    vi.clearAllMocks();
    destroyInjector();
  });

  it('should be provided', () => {
    expect(service).toBeInstanceOf(DefaultCartAdapter);
  });

  describe('getAll should send `get` request', () => {
    beforeEach(() => {
      http.flush(mockGetCartsResponse);
    });

    describe('guest user', () => {
      it('should build url', () => {
        service.getAll().subscribe();

        expect(http.url).toBe(`${mockApiUrl}/guest-carts${requestIncludes()}`);
      });
    });

    describe('loggedIn user', () => {
      beforeEach(() => {
        identity.get.mockReturnValue(of(mockUser));
      });

      it('should build url', async () => {
        service.getAll().subscribe();

        expect(http.url).toBe(
          `${mockApiUrl}/customers/${mockUser.userId}/carts${requestIncludes(
            true
          )}`
        );
      });
    });

    describe('data transforming', () => {
      it('should call transformer with proper normalizer', () => {
        service.getAll().subscribe();

        expect(mockTransformer.do).toHaveBeenCalledWith(CartsNormalizer);
      });

      it('should return transformed data', () => {
        const mockTransformerData = 'mockTransformerData';
        const callback = vi.fn();
        mockTransformer.do.mockReturnValue(() => of(mockTransformerData));

        service.getAll().subscribe(callback);

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
        service.get(mockGuestGetCartQualifier).subscribe();

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
        service.get(mockGetCartQualifier).subscribe();

        expect(http.url).toBe(
          `${mockApiUrl}/carts/${mockGetCartQualifier.cartId}${requestIncludes(
            true
          )}`
        );
      });
    });

    describe('data transforming', () => {
      it('should call transformer data with proper normalizer', () => {
        service.get(mockGuestGetCartQualifier).subscribe();

        expect(mockTransformer.do).toHaveBeenCalledWith(CartNormalizer);
      });

      it('should return transformed data', () => {
        const mockTransformerData = 'mockTransformerData';
        const callback = vi.fn();
        mockTransformer.do.mockReturnValue(() => of(mockTransformerData));

        service.get(mockGuestGetCartQualifier).subscribe(callback);

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
        service.addEntry(mockGuestAddEntryQualifier).subscribe();

        expect(http.url).toBe(
          `${mockApiUrl}/guest-carts/${
            mockGuestAddEntryQualifier.cartId
          }/guest-cart-items${requestIncludes()}`
        );
      });

      it('should provide body', () => {
        service.addEntry(mockGuestAddEntryQualifier).subscribe();

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
        service.addEntry(mockAddEntryQualifier).subscribe();

        expect(http.url).toBe(
          `${mockApiUrl}/carts/${
            mockAddEntryQualifier.cartId
          }/items${requestIncludes(true)}`
        );
      });

      it('should provide body', () => {
        service.addEntry(mockAddEntryQualifier).subscribe();

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
        service.addEntry(mockGuestAddEntryQualifier).subscribe();

        expect(mockTransformer.do).toHaveBeenCalledWith(CartNormalizer);
      });

      it('should return transformed data', () => {
        const mockTransformerData = 'mockTransformerData';
        const callback = vi.fn();
        mockTransformer.do.mockReturnValue(() => of(mockTransformerData));

        service.addEntry(mockGuestAddEntryQualifier).subscribe(callback);

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
        service.updateEntry(mockGuestUpdateEntryQualifier).subscribe();

        expect(http.url).toBe(
          `${mockApiUrl}/guest-carts/${
            mockGuestUpdateEntryQualifier.cartId
          }/guest-cart-items/${
            mockGuestUpdateEntryQualifier.groupKey
          }${requestIncludes()}`
        );
      });

      it('should provide body', () => {
        service.updateEntry(mockGuestUpdateEntryQualifier).subscribe();

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
        service.updateEntry(mockUpdateEntryQualifier).subscribe();

        expect(http.url).toBe(
          `${mockApiUrl}/carts/${mockUpdateEntryQualifier.cartId}/items/${
            mockUpdateEntryQualifier.groupKey
          }${requestIncludes(true)}`
        );
      });

      it('should provide body', () => {
        service.updateEntry(mockUpdateEntryQualifier).subscribe();

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
        service.addEntry(mockUpdateEntryQualifier).subscribe();

        expect(mockTransformer.do).toHaveBeenCalledWith(CartNormalizer);
      });

      it('should return transformed data', () => {
        const mockTransformerData = 'mockTransformerData';
        const callback = vi.fn();
        mockTransformer.do.mockReturnValue(() => of(mockTransformerData));

        service.addEntry(mockUpdateEntryQualifier).subscribe(callback);

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
        service.deleteEntry(mockGuestDeleteEntryQualifier).subscribe();

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
        service.deleteEntry(mockDeleteEntryQualifier).subscribe();

        expect(http.url).toBe(
          `${mockApiUrl}/carts/${mockDeleteEntryQualifier.cartId}/items/${
            mockDeleteEntryQualifier.groupKey
          }${requestIncludes(true)}`
        );
      });
    });

    it('should do emission', () => {
      const callback = vi.fn();

      service.deleteEntry(mockDeleteEntryQualifier).subscribe(callback);

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

      service.addEntry(mockRegisteredAddEntryQualifier).subscribe(callback);

      expect(http.urls).toStrictEqual([
        `${mockApiUrl}/carts`,
        `${mockApiUrl}/carts/newCartId/items?include=items`,
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

      service.addEntry(mockRegisteredAddEntryQualifier).subscribe(callback);

      expect(http.url).toBe(
        `${mockApiUrl}/carts/${
          mockRegisteredAddEntryQualifier.cartId
        }/items${requestIncludes(true)}`
      );

      expect(http.urls).toStrictEqual([
        `${mockApiUrl}/carts/testCartId/items?include=items`,
      ]);
      expect(callback).toHaveBeenCalledWith(mockResponse);
    });
  });
});
