import { IdentityService } from '@spryker-oryx/auth';
import {
  mockCheckout,
  mockGetShipmentResponse,
  mockPlaceOrderResponse,
  mockPostCheckoutProps,
  mockShipmentAttributes,
} from '@spryker-oryx/checkout/mocks';
import { HttpService, JsonAPITransformerService } from '@spryker-oryx/core';
import { HttpTestService } from '@spryker-oryx/core/testing';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { of } from 'rxjs';
import { ApiCheckoutModel } from '../../models';
import { CheckoutAdapter, UpdateCheckoutDataProps } from './checkout.adapter';
import { DefaultCheckoutAdapter } from './default-checkout.adapter';
import { CheckoutNormalizer, CheckoutResponseNormalizer } from './normalizers';

const mockApiUrl = 'mockApiUrl';
const cartId = 'mockid';

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

const mockAnonymousUser = { id: 'anonymousUserId', anonymous: true };

class MockIdentityService implements Partial<IdentityService> {
  get = vi.fn().mockReturnValue(of(mockAnonymousUser));
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
      cartId,
      include: [ApiCheckoutModel.Includes.Shipments],
    };

    const mockSerializedGetCheckoutDataProps = {
      data: {
        type: 'checkout-data',
        attributes: {
          cartId: mockGetCheckoutDataQualifier.cartId,
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

    it('should call transformer with proper normalizer', () => {
      http.flush(mockGetShipmentResponse);
      service.get(mockGetCheckoutDataQualifier).subscribe();

      expect(mockTransformer.do).toHaveBeenCalledWith(CheckoutNormalizer);
    });

    it('should return transformed data', () => {
      mockTransformer.do.mockReturnValue(() => of(mockTransformerData));
      service.get(mockGetCheckoutDataQualifier).subscribe(callback);

      expect(callback).toHaveBeenCalledWith(mockTransformerData);
    });
  });

  describe('update should send `post` request', () => {
    const mockUpdateQualifier: UpdateCheckoutDataProps = {
      cartId,
      include: [ApiCheckoutModel.Includes.Shipments],
      attributes: {
        shipments: [{ ...mockShipmentAttributes, idShipmentMethod: 1 }],
      },
    };

    const mockSerializedUpdateCheckoutDataProps = {
      data: {
        type: 'checkout-data',
        attributes: {
          cartId,
          shipments: [{ ...mockShipmentAttributes, idShipmentMethod: 1 }],
        },
      },
    };

    it('should build url', () => {
      service.update(mockUpdateQualifier).subscribe(() => {
        expect(http.url).toBe(`${mockApiUrl}/checkout-data?include=shipments`);
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

      expect(mockTransformer.do).toHaveBeenCalledWith(CheckoutNormalizer);
    });

    it('should return transformed data', () => {
      mockTransformer.do.mockReturnValue(() => of(mockTransformerData));

      service.update(mockUpdateQualifier).subscribe(callback);

      expect(callback).toHaveBeenCalledWith(mockTransformerData);
    });
  });

  describe('when placing an order', () => {
    describe('and user is not logged in', () => {
      it('should build url', () => {
        service.placeOrder(mockPostCheckoutProps).subscribe(() => {
          expect(http.url).toBe(`${mockApiUrl}/checkout?include=orders`);
        });
      });
    });

    describe('and user is logged in', () => {
      it('should build url', () => {
        identity.get.mockReturnValue(of({ id: 'mockuser' }));
        service.placeOrder(mockPostCheckoutProps).subscribe(() => {
          expect(http.url).toBe(`${mockApiUrl}/checkout`);
        });
      });
    });

    it('should provide body', () => {
      mockTransformer.serialize.mockReturnValue(of(mockCheckout));
      service.placeOrder(mockPostCheckoutProps).subscribe(() => {
        expect(http.body).toEqual(mockCheckout);
      });
    });

    it('should call transformer with proper normalizer', () => {
      http.flush(mockPlaceOrderResponse);
      service.placeOrder(mockPostCheckoutProps).subscribe();

      expect(mockTransformer.do).toHaveBeenCalledWith(
        CheckoutResponseNormalizer
      );
    });

    it('should return transformed data', () => {
      mockTransformer.do.mockReturnValue(() => of(mockTransformerData));

      service.placeOrder(mockPostCheckoutProps).subscribe(callback);

      expect(callback).toHaveBeenCalledWith(mockTransformerData);
    });
  });
});
