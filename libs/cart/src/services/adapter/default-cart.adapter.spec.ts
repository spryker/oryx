import { IdentityService } from '@spryker-oryx/auth';
import { mockGetCartsResponse } from '@spryker-oryx/cart/mocks';
import { HttpService, JsonAPITransformerService } from '@spryker-oryx/core';
import { HttpTestService } from '@spryker-oryx/core/testing';
import { createInjector, destroyInjector } from '@spryker-oryx/injector';
import { of } from 'rxjs';
import { ApiCartModel } from '../../models';
import { CartAdapter } from './cart.adapter';
import { DefaultCartAdapter } from './default-cart.adapter';
import { CartNormalizer, CartsNormalizer } from './normalizers';

const mockApiUrl = 'mockApiUrl';

const mockAnonymousUser = {
  id: 'userId',
  anonymous: true,
};

const mockUser = {
  id: 'userId',
  anonymous: false,
  token: { accessToken: 'token' },
};

const mockTransformer = {
  do: vi.fn().mockReturnValue(() => of(null)),
  transform: vi.fn(),
};

class MockIdentityService implements Partial<IdentityService> {
  get = vi.fn().mockReturnValue(of(mockAnonymousUser));
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
          `${mockApiUrl}/customers/${mockUser.id}/carts${requestIncludes(true)}`
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
      attributes: {
        sku: 'sku',
        quantity: 1,
      },
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
            attributes: mockGuestAddEntryQualifier.attributes,
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
            attributes: mockAddEntryQualifier.attributes,
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
      attributes: {
        sku: 'sku',
        quantity: 1,
      },
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
            attributes: mockGuestUpdateEntryQualifier.attributes,
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
            attributes: mockUpdateEntryQualifier.attributes,
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
});
