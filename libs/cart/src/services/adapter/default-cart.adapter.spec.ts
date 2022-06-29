import { HttpService } from '@spryker-oryx/core';
import { HttpTestService } from '@spryker-oryx/core/testing';
import { createInjector, destroyInjector } from '@spryker-oryx/injector';
import {
  mockGetCartResponse,
  mockGetCartsResponse,
  mockNormalizedCart,
  mockNormalizedDefaultCart,
} from '../../mocks/mock-cart';
import { CartAdapter, CART_INCLUDES } from './cart.adapter';
import { DefaultCartAdapter } from './default-cart.adapter';

const mockApiUrl = 'mockApiUrl';

const mockUserQualifier = { anonymousUserId: 'anonymousUserId' };

const mockRequestHeaders = {
  'X-Anonymous-Customer-Unique-Id': mockUserQualifier.anonymousUserId,
};

describe('DefaultProductService', () => {
  const callback = vi.fn();

  let service: CartAdapter;
  let http: HttpTestService;
  let testInjector;

  function requestIncludes(): string {
    return `?include=${Object.values(CART_INCLUDES).join(',')}`;
  }

  beforeEach(() => {
    testInjector = createInjector({
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
      ],
    });

    service = testInjector.inject(CartAdapter);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    http = testInjector.inject(HttpService) as HttpTestService;
    http.flush(mockGetCartResponse);
  });

  afterEach(() => {
    destroyInjector();
  });

  it('should be provided', () => {
    expect(service).toBeInstanceOf(DefaultCartAdapter);
  });

  describe('getAll should send `get` request', () => {
    beforeEach(() => {
      http.flush(mockGetCartsResponse);
      service.getAll(mockUserQualifier).subscribe(callback);
    });

    it('should return normalized cart array', () => {
      expect(callback).toHaveBeenCalledWith([
        mockNormalizedCart,
        mockNormalizedDefaultCart,
      ]);
    });

    it('should build url', () => {
      expect(http.url).toBe(`${mockApiUrl}/guest-carts${requestIncludes()}`);
    });

    it('should provide headers', () => {
      expect(http.options).toHaveProperty('headers', mockRequestHeaders);
    });
  });

  describe('get should send `get` request', () => {
    const mockGetCartQualifier = {
      cartId: 'test',
      user: mockUserQualifier,
    };

    beforeEach(() => {
      service.get(mockGetCartQualifier).subscribe(callback);
    });

    it('should return normalized cart', () => {
      expect(callback).toHaveBeenCalledWith(mockNormalizedCart);
    });

    it('should build url', () => {
      expect(http.url).toBe(
        `${mockApiUrl}/guest-carts/${
          mockGetCartQualifier.cartId
        }${requestIncludes()}`
      );
    });

    it('should provide headers', () => {
      expect(http.options).toHaveProperty('headers', mockRequestHeaders);
    });
  });

  describe('addEntry should send `post` request', () => {
    const mockAddEntryQualifier = {
      cartId: 'test',
      user: mockUserQualifier,
      attributes: {
        sku: 'sku',
        quantity: 1,
      },
    };

    beforeEach(() => {
      service.addEntry(mockAddEntryQualifier).subscribe(callback);
    });

    it('should return normalized cart', () => {
      expect(callback).toHaveBeenCalledWith(mockNormalizedCart);
    });

    it('should build url', () => {
      expect(http.url).toBe(
        `${mockApiUrl}/guest-carts/${
          mockAddEntryQualifier.cartId
        }/guest-cart-items${requestIncludes()}`
      );
    });

    it('should provide headers', () => {
      expect(http.options).toHaveProperty('headers', mockRequestHeaders);
    });

    it('should provide body', () => {
      expect(http.body).toMatchObject({
        data: {
          type: 'guest-cart-items',
          attributes: mockAddEntryQualifier.attributes,
        },
      });
    });
  });

  describe('updateEntry should send `patch` request', () => {
    const mockUpdateEntryQualifier = {
      cartId: 'test',
      user: mockUserQualifier,
      groupKey: 'groupKey',
      attributes: {
        sku: 'sku',
        quantity: 1,
      },
    };

    beforeEach(() => {
      service.updateEntry(mockUpdateEntryQualifier).subscribe(callback);
    });

    it('should return normalized cart', () => {
      expect(callback).toHaveBeenCalledWith(mockNormalizedCart);
    });

    it('should build url', () => {
      expect(http.url).toBe(
        `${mockApiUrl}/guest-carts/${
          mockUpdateEntryQualifier.cartId
        }/guest-cart-items/${
          mockUpdateEntryQualifier.groupKey
        }${requestIncludes()}`
      );
    });

    it('should provide headers', () => {
      expect(http.options).toHaveProperty('headers', mockRequestHeaders);
    });

    it('should provide body', () => {
      expect(http.body).toMatchObject({
        data: {
          type: 'guest-cart-items',
          attributes: mockUpdateEntryQualifier.attributes,
        },
      });
    });
  });

  describe('deleteEntry should send `delete` request', () => {
    const mockDeleteEntryQualifier = {
      cartId: 'test',
      user: mockUserQualifier,
      groupKey: 'groupKey',
    };

    beforeEach(() => {
      http.flush(null);
      service.deleteEntry(mockDeleteEntryQualifier).subscribe(callback);
    });

    it('should return normalized cart', () => {
      expect(callback).toHaveBeenCalledWith(null);
    });

    it('should build url', () => {
      expect(http.url).toBe(
        `${mockApiUrl}/guest-carts/${
          mockDeleteEntryQualifier.cartId
        }/guest-cart-items/${
          mockDeleteEntryQualifier.groupKey
        }${requestIncludes()}`
      );
    });

    it('should provide headers', () => {
      expect(http.options).toHaveProperty('headers', mockRequestHeaders);
    });
  });
});
