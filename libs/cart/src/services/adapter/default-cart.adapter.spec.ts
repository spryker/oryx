import {
  HttpService,
  IdentityService,
  JsonAPITransformerService,
} from '@spryker-oryx/core';
import { HttpTestService } from '@spryker-oryx/core/testing';
import { createInjector, destroyInjector } from '@spryker-oryx/injector';
import { of } from 'rxjs';
import {
  mockGetCartResponse,
  mockGetCartsResponse,
} from '../../mocks/mock-cart';
import { ApiCartModel } from '../../models';
import { CartAdapter } from './cart.adapter';
import { DefaultCartAdapter } from './default-cart.adapter';
import { CartNormalizers, CartsNormalizers } from './normalizers';

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

const mockRequestHeaders = {
  Authorization: 'Authorization',
};

const mockAnonymousRequestHeaders = {
  'X-Anonymous-Customer-Unique-Id': mockAnonymousUser.id,
};
const mockTransformer = {
  transform: vi.fn().mockReturnValue(of(null)),
};

class MockIdentityService implements Partial<IdentityService> {
  get = vi.fn().mockReturnValue(of(mockAnonymousUser));
  getHeaders = vi.fn().mockReturnValue(of(mockAnonymousRequestHeaders));
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
    http.flush(mockGetCartResponse);
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

      it('should provide headers', () => {
        service.getAll().subscribe();

        expect(http.options).toHaveProperty(
          'headers',
          mockAnonymousRequestHeaders
        );
      });
    });

    describe('loggedIn user', () => {
      beforeEach(() => {
        identity.get.mockReturnValue(of(mockUser));
        identity.getHeaders.mockReturnValue(of(mockRequestHeaders));
      });

      it('should build url', () => {
        service.getAll().subscribe();

        expect(http.url).toBe(
          `${mockApiUrl}/customers/${mockUser.id}/carts${requestIncludes(true)}`
        );
      });

      it('should provide headers', () => {
        service.getAll().subscribe();

        expect(http.options).toHaveProperty('headers', mockRequestHeaders);
      });
    });

    describe('data transforming', () => {
      it('should call transformer data with data from response', () => {
        service.getAll().subscribe();

        expect(mockTransformer.transform).toHaveBeenCalledWith(
          mockGetCartsResponse,
          CartsNormalizers
        );
      });

      it('should return transformed data', () => {
        const mockTransformerData = 'mockTransformerData';
        const callback = vi.fn();
        mockTransformer.transform.mockReturnValue(of(mockTransformerData));

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

      it('should provide headers', () => {
        service.get(mockGuestGetCartQualifier).subscribe();

        expect(http.options).toHaveProperty(
          'headers',
          mockAnonymousRequestHeaders
        );
      });
    });

    describe('loggedIn user', () => {
      beforeEach(() => {
        identity.get.mockReturnValue(of(mockUser));
        identity.getHeaders.mockReturnValue(of(mockRequestHeaders));
      });

      it('should build url', () => {
        service.get(mockGetCartQualifier).subscribe();

        expect(http.url).toBe(
          `${mockApiUrl}/carts/${mockGetCartQualifier.cartId}${requestIncludes(
            true
          )}`
        );
      });

      it('should provide headers', () => {
        service.get(mockGetCartQualifier).subscribe();

        expect(http.options).toHaveProperty('headers', mockRequestHeaders);
      });
    });

    describe('data transforming', () => {
      it('should call transformer data with data from response', () => {
        service.get(mockGuestGetCartQualifier).subscribe();

        expect(mockTransformer.transform).toHaveBeenCalledWith(
          mockGetCartResponse,
          CartNormalizers
        );
      });

      it('should return transformed data', () => {
        const mockTransformerData = 'mockTransformerData';
        const callback = vi.fn();
        mockTransformer.transform.mockReturnValue(of(mockTransformerData));

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

      it('should provide headers', () => {
        service.addEntry(mockGuestAddEntryQualifier).subscribe();

        expect(http.options).toHaveProperty(
          'headers',
          mockAnonymousRequestHeaders
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
        identity.getHeaders.mockReturnValue(of(mockRequestHeaders));
      });

      it('should build url', () => {
        service.addEntry(mockAddEntryQualifier).subscribe();

        expect(http.url).toBe(
          `${mockApiUrl}/carts/${
            mockAddEntryQualifier.cartId
          }/items${requestIncludes(true)}`
        );
      });

      it('should provide headers', () => {
        service.addEntry(mockAddEntryQualifier).subscribe();

        expect(http.options).toHaveProperty('headers', mockRequestHeaders);
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
      it('should call transformer data with data from response', () => {
        service.addEntry(mockGuestAddEntryQualifier).subscribe();

        expect(mockTransformer.transform).toHaveBeenCalledWith(
          mockGetCartResponse,
          CartNormalizers
        );
      });

      it('should return transformed data', () => {
        const mockTransformerData = 'mockTransformerData';
        const callback = vi.fn();
        mockTransformer.transform.mockReturnValue(of(mockTransformerData));

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

      it('should provide headers', () => {
        service.updateEntry(mockGuestUpdateEntryQualifier).subscribe();

        expect(http.options).toHaveProperty(
          'headers',
          mockAnonymousRequestHeaders
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
        identity.getHeaders.mockReturnValue(of(mockRequestHeaders));
      });

      it('should build url', () => {
        service.updateEntry(mockUpdateEntryQualifier).subscribe();

        expect(http.url).toBe(
          `${mockApiUrl}/carts/${mockUpdateEntryQualifier.cartId}/items/${
            mockUpdateEntryQualifier.groupKey
          }${requestIncludes(true)}`
        );
      });

      it('should provide headers', () => {
        service.updateEntry(mockUpdateEntryQualifier).subscribe();

        expect(http.options).toHaveProperty('headers', mockRequestHeaders);
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
      it('should call transformer data with data from response', () => {
        service.addEntry(mockUpdateEntryQualifier).subscribe();

        expect(mockTransformer.transform).toHaveBeenCalledWith(
          mockGetCartResponse,
          CartNormalizers
        );
      });

      it('should return transformed data', () => {
        const mockTransformerData = 'mockTransformerData';
        const callback = vi.fn();
        mockTransformer.transform.mockReturnValue(of(mockTransformerData));

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

      it('should provide headers', () => {
        service.deleteEntry(mockGuestDeleteEntryQualifier).subscribe();

        expect(http.options).toHaveProperty(
          'headers',
          mockAnonymousRequestHeaders
        );
      });
    });

    describe('loggedIn user', () => {
      beforeEach(() => {
        identity.get.mockReturnValue(of(mockUser));
        identity.getHeaders.mockReturnValue(of(mockRequestHeaders));
      });

      it('should build url', () => {
        service.deleteEntry(mockDeleteEntryQualifier).subscribe();

        expect(http.url).toBe(
          `${mockApiUrl}/carts/${mockDeleteEntryQualifier.cartId}/items/${
            mockDeleteEntryQualifier.groupKey
          }${requestIncludes(true)}`
        );
      });

      it('should provide headers', () => {
        service.deleteEntry(mockDeleteEntryQualifier).subscribe();

        expect(http.options).toHaveProperty('headers', mockRequestHeaders);
      });
    });

    it('should do emission', () => {
      const callback = vi.fn();

      service.deleteEntry(mockDeleteEntryQualifier).subscribe(callback);

      expect(callback).toHaveBeenCalled();
    });
  });
});
