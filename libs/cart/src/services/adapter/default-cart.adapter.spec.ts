import { HttpService, JsonAPITransformerService } from '@spryker-oryx/core';
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
import { CartNormalizers } from './normalizers';

const mockApiUrl = 'mockApiUrl';

const mockUserQualifier = { anonymousUserId: 'anonymousUserId' };

const mockRequestHeaders = {
  'X-Anonymous-Customer-Unique-Id': mockUserQualifier.anonymousUserId,
};
const mockTransformer = {
  transform: vi.fn().mockReturnValue(of(null)),
};

describe('DefaultProductService', () => {
  let service: CartAdapter;
  let http: HttpTestService;

  function requestIncludes(): string {
    return `?include=${Object.values(ApiCartModel.Includes).join(',')}`;
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
    });

    it('should build url', () => {
      service.getAll(mockUserQualifier);

      expect(http.url).toBe(`${mockApiUrl}/guest-carts${requestIncludes()}`);
    });

    it('should provide headers', () => {
      service.getAll(mockUserQualifier);

      expect(http.options).toHaveProperty('headers', mockRequestHeaders);
    });
  });

  describe('get should send `get` request', () => {
    const mockGetCartQualifier = {
      cartId: 'test',
      user: mockUserQualifier,
    };

    it('should build url', () => {
      service.get(mockGetCartQualifier);

      expect(http.url).toBe(
        `${mockApiUrl}/guest-carts/${
          mockGetCartQualifier.cartId
        }${requestIncludes()}`
      );
    });

    it('should provide headers', () => {
      service.get(mockGetCartQualifier);

      expect(http.options).toHaveProperty('headers', mockRequestHeaders);
    });

    it('should call transformer data with data from response', () => {
      service.get(mockGetCartQualifier).subscribe();

      expect(mockTransformer.transform).toHaveBeenCalledWith(
        mockGetCartResponse,
        CartNormalizers
      );
    });

    it('should return transformed data', () => {
      const mockTransformerData = 'mockTransformerData';
      const callback = vi.fn();
      mockTransformer.transform.mockReturnValue(of(mockTransformerData));

      service.get(mockGetCartQualifier).subscribe(callback);

      expect(callback).toHaveBeenCalledWith(mockTransformerData);
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

    it('should build url', () => {
      service.addEntry(mockAddEntryQualifier);
      expect(http.url).toBe(
        `${mockApiUrl}/guest-carts/${
          mockAddEntryQualifier.cartId
        }/guest-cart-items${requestIncludes()}`
      );
    });

    it('should provide headers', () => {
      service.addEntry(mockAddEntryQualifier);
      expect(http.options).toHaveProperty('headers', mockRequestHeaders);
    });

    it('should provide body', () => {
      service.addEntry(mockAddEntryQualifier);
      expect(http.body).toMatchObject({
        data: {
          type: 'guest-cart-items',
          attributes: mockAddEntryQualifier.attributes,
        },
      });
    });

    it('should call transformer data with data from response', () => {
      service.addEntry(mockAddEntryQualifier).subscribe();

      expect(mockTransformer.transform).toHaveBeenCalledWith(
        mockGetCartResponse,
        CartNormalizers
      );
    });

    it('should return transformed data', () => {
      const mockTransformerData = 'mockTransformerData';
      const callback = vi.fn();
      mockTransformer.transform.mockReturnValue(of(mockTransformerData));

      service.addEntry(mockAddEntryQualifier).subscribe(callback);

      expect(callback).toHaveBeenCalledWith(mockTransformerData);
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

    it('should build url', () => {
      service.updateEntry(mockUpdateEntryQualifier);
      expect(http.url).toBe(
        `${mockApiUrl}/guest-carts/${
          mockUpdateEntryQualifier.cartId
        }/guest-cart-items/${
          mockUpdateEntryQualifier.groupKey
        }${requestIncludes()}`
      );
    });

    it('should provide headers', () => {
      service.updateEntry(mockUpdateEntryQualifier);
      expect(http.options).toHaveProperty('headers', mockRequestHeaders);
    });

    it('should provide body', () => {
      service.updateEntry(mockUpdateEntryQualifier);
      expect(http.body).toMatchObject({
        data: {
          type: 'guest-cart-items',
          attributes: mockUpdateEntryQualifier.attributes,
        },
      });
    });

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

  describe('deleteEntry should send `delete` request', () => {
    const mockDeleteEntryQualifier = {
      cartId: 'test',
      user: mockUserQualifier,
      groupKey: 'groupKey',
    };

    beforeEach(() => {
      http.flush(null);
    });

    it('should build url', () => {
      service.deleteEntry(mockDeleteEntryQualifier);
      expect(http.url).toBe(
        `${mockApiUrl}/guest-carts/${
          mockDeleteEntryQualifier.cartId
        }/guest-cart-items/${
          mockDeleteEntryQualifier.groupKey
        }${requestIncludes()}`
      );
    });

    it('should provide headers', () => {
      service.deleteEntry(mockDeleteEntryQualifier);
      expect(http.options).toHaveProperty('headers', mockRequestHeaders);
    });

    it('should do emission', () => {
      const callback = vi.fn();
      service.deleteEntry(mockDeleteEntryQualifier).subscribe(callback);
      expect(callback).toHaveBeenCalled();
    });
  });
});
