import { IdentityService } from '@spryker-oryx/auth';
import {
  mockGetShipmentResponse,
  mockShipmentAttributes,
} from '@spryker-oryx/checkout/mocks';
import { HttpService, JsonAPITransformerService } from '@spryker-oryx/core';
import { HttpTestService } from '@spryker-oryx/core/testing';
import { createInjector, destroyInjector } from '@spryker-oryx/injector';
import { of } from 'rxjs';
import { ApiCheckoutModel } from '../../models';
import { CheckoutAdapter, UpdateCheckoutDataProps } from './checkout.adapter';
import { DefaultCheckoutAdapter } from './default-checkout.adapter';
import { CheckoutNormalizers } from './normalizers';

const mockApiUrl = 'mockApiUrl';
const idCart = 'mockid';

const mockTransformer = {
  transform: vi.fn().mockReturnValue(of(null)),
  serialize: vi.fn().mockReturnValue(of(null)),
  do: vi.fn().mockReturnValue(() => of(null)),
};

const mockUser = {
  id: 'userId',
  anonymous: false,
  token: { accessToken: 'token' },
};

const mockRequestHeaders = {
  Authorization: 'Authorization',
};

const mockAnonymousUser = { id: 'anonymousUserId', anonymous: true };

const mockAnonymousRequestHeaders = {
  'X-Anonymous-Customer-Unique-Id': mockAnonymousUser.id,
};

class MockIdentityService implements Partial<IdentityService> {
  get = vi.fn().mockReturnValue(of(mockAnonymousUser));
  getHeaders = vi.fn().mockReturnValue(of(mockAnonymousRequestHeaders));
}

describe('DefaultCheckoutService', () => {
  let service: CheckoutAdapter;
  let identity: MockIdentityService;
  let http: HttpTestService;
  const mockTransformerData = 'mockTransformerData';
  const callback = vi.fn();

  beforeEach(() => {
    const testInjector = createInjector({
      providers: [
        {
          provide: HttpService,
          useClass: HttpTestService,
        },
        {
          provide: CheckoutAdapter,
          useClass: DefaultCheckoutAdapter,
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

    service = testInjector.inject(CheckoutAdapter);

    http = testInjector.inject(HttpService) as unknown as HttpTestService;
    identity = testInjector.inject(IdentityService) as MockIdentityService;
  });

  afterEach(() => {
    vi.clearAllMocks();
    destroyInjector();
  });

  it('should be provided', () => {
    expect(service).toBeInstanceOf(DefaultCheckoutAdapter);
  });

  describe('get should send `post` request', () => {
    const mockGetCheckoutDataQualifier = {
      idCart,
      include: [ApiCheckoutModel.Includes.Shipments],
    };

    const mockSerializedGetCheckoutDataProps = {
      data: {
        type: 'checkout-data',
        attributes: {
          idCart: mockGetCheckoutDataQualifier.idCart,
        },
      },
    };

    it('should build url', () => {
      service.get(mockGetCheckoutDataQualifier).subscribe(() => {
        expect(http.url).toBe(`${mockApiUrl}/checkout-data?include=shipments`);
      });
    });

    it('should provide body', () => {
      mockTransformer.serialize.mockReturnValue(
        of(mockSerializedGetCheckoutDataProps)
      );
      service.get(mockGetCheckoutDataQualifier).subscribe(() => {
        expect(http.body).toEqual(mockSerializedGetCheckoutDataProps);
      });
    });

    it('should provide headers for guest users', () => {
      service.get(mockGetCheckoutDataQualifier).subscribe(() => {
        expect(http.options).toHaveProperty(
          'headers',
          mockAnonymousRequestHeaders
        );
      });
    });

    it('should provide headers for logged in users', () => {
      identity.get.mockReturnValue(of(mockUser));
      identity.getHeaders.mockReturnValue(of(mockRequestHeaders));
      service.get(mockGetCheckoutDataQualifier).subscribe(() => {
        expect(http.options).toHaveProperty('headers', mockRequestHeaders);
      });
    });

    it('should call transformer with proper normalizer', () => {
      http.flush(mockGetShipmentResponse);
      service.get(mockGetCheckoutDataQualifier).subscribe();

      expect(mockTransformer.do).toHaveBeenCalledWith(CheckoutNormalizers);
    });

    it('should return transformed data', () => {
      mockTransformer.do.mockReturnValue(() => of(mockTransformerData));
      service.get(mockGetCheckoutDataQualifier).subscribe(callback);

      expect(callback).toHaveBeenCalledWith(mockTransformerData);
    });
  });

  describe('update should send `post` request', () => {
    const mockUpdateQualifier: UpdateCheckoutDataProps = {
      idCart,
      include: [ApiCheckoutModel.Includes.Shipments],
      attributes: {
        shipments: [{ ...mockShipmentAttributes, idShipmentMethod: 1 }],
      },
    };

    const mockSerializedUpdateCheckoutDataProps = {
      data: {
        type: 'checkout-data',
        attributes: {
          idCart,
          shipments: [{ ...mockShipmentAttributes, idShipmentMethod: 1 }],
        },
      },
    };

    it('should build url', () => {
      service.update(mockUpdateQualifier).subscribe(() => {
        expect(http.url).toBe(`${mockApiUrl}/checkout-data?include=shipments`);
      });
    });

    it('should provide headers for guest users', () => {
      service.update(mockUpdateQualifier).subscribe(() => {
        expect(http.options).toHaveProperty(
          'headers',
          mockAnonymousRequestHeaders
        );
      });
    });

    it('should provide headers for logged in users', () => {
      identity.get.mockReturnValue(of(mockUser));
      identity.getHeaders.mockReturnValue(of(mockRequestHeaders));
      service.update(mockUpdateQualifier).subscribe(() => {
        expect(http.options).toHaveProperty('headers', mockRequestHeaders);
      });
    });

    it('should provide body', () => {
      mockTransformer.serialize.mockReturnValue(
        of(mockSerializedUpdateCheckoutDataProps)
      );
      service.update(mockUpdateQualifier).subscribe(() => {
        expect(http.body).toEqual(mockSerializedUpdateCheckoutDataProps);
      });
    });

    it('should call transformer with proper normalizer', () => {
      http.flush(mockGetShipmentResponse);
      service.update(mockUpdateQualifier).subscribe();

      expect(mockTransformer.do).toHaveBeenCalledWith(CheckoutNormalizers);
    });

    it('should return transformed data', () => {
      mockTransformer.do.mockReturnValue(() => of(mockTransformerData));

      service.update(mockUpdateQualifier).subscribe(callback);

      expect(callback).toHaveBeenCalledWith(mockTransformerData);
    });
  });
});
