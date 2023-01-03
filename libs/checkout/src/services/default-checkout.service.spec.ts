import { CartService } from '@spryker-oryx/cart';
import {
  Address,
  CheckoutDataService,
  CheckoutOrchestrationService,
  CheckoutResponse,
  CheckoutService,
  ContactDetails,
  DefaultCheckoutService,
  PaymentMethod,
  Shipment,
  Validity,
} from '@spryker-oryx/checkout';
import { RouterService } from '@spryker-oryx/experience';
import {
  createInjector,
  destroyInjector,
  Injector,
} from '@spryker-oryx/injector';
import { SemanticLinkService } from '@spryker-oryx/site';
import { firstValueFrom, of } from 'rxjs';
import { describe } from 'vitest';
import { CheckoutAdapter } from './adapter';

class MockCheckoutOrchestrationService
  implements Partial<CheckoutOrchestrationService>
{
  getValidity = vi.fn().mockReturnValue(of([]));
  submit = vi.fn();
}

class MockCheckoutDataService implements Partial<CheckoutDataService> {
  isGuestCheckout = vi.fn().mockReturnValue(of(false));
  getContactDetails = vi.fn().mockReturnValue(of({} as ContactDetails));
  getAddressDetails = vi.fn().mockReturnValue(of({} as Address));
  getShipmentDetails = vi.fn().mockReturnValue(of({} as Shipment));
  getPaymentDetails = vi.fn().mockReturnValue(of({} as PaymentMethod));
}

class MockCheckoutAdapter implements Partial<CheckoutAdapter> {
  placeOrder = vi
    .fn()
    .mockReturnValue(of({ orderReference: 'test' } as CheckoutResponse));
}

class MockCartService implements Partial<CartService> {
  getCart = vi.fn().mockReturnValue(of({}));
  load = vi.fn().mockReturnValue(of({}));
}

class MockSemanticLinkService implements Partial<SemanticLinkService> {
  get = vi.fn().mockReturnValue(of('order/test'));
}

class MockRouterService implements Partial<RouterService> {
  navigate = vi.fn();
}

describe('DefaultCheckoutService', () => {
  let injector: Injector;
  const service = () => injector.inject(CheckoutService);

  beforeEach(() => {
    injector = createInjector({
      providers: [
        {
          provide: CheckoutOrchestrationService,
          useClass: MockCheckoutOrchestrationService,
        },
        {
          provide: CheckoutDataService,
          useClass: MockCheckoutDataService,
        },
        {
          provide: CheckoutAdapter,
          useClass: MockCheckoutAdapter,
        },
        {
          provide: CartService,
          useClass: MockCartService,
        },
        {
          provide: SemanticLinkService,
          useClass: MockSemanticLinkService,
        },
        {
          provide: RouterService,
          useClass: MockRouterService,
        },
        {
          provide: CheckoutService,
          useClass: DefaultCheckoutService,
        },
      ],
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
    destroyInjector();
  });

  it('should be provided', () => {
    expect(service()).toBeInstanceOf(DefaultCheckoutService);
  });

  describe('canCheckout', () => {
    describe('when canCheckout is valid', () => {
      beforeEach(() => {
        (
          injector.inject(
            CheckoutOrchestrationService
          ) as unknown as MockCheckoutOrchestrationService
        ).getValidity.mockReturnValue(of([{ validity: Validity.Valid }]));
      });

      it('should return true', async () => {
        expect(await firstValueFrom(service().canCheckout())).toBe(true);
      });
    });

    describe('when checkout data is not valid', () => {
      beforeEach(() => {
        (
          injector.inject(
            CheckoutOrchestrationService
          ) as unknown as MockCheckoutOrchestrationService
        ).getValidity.mockReturnValue(of([{ validity: Validity.Invalid }]));
      });

      it('should return false', async () => {
        expect(await firstValueFrom(service().canCheckout())).toBe(false);
      });
    });
  });

  describe('placeOrder', () => {
    it('should submit the checkout data to the adapter', async () => {
      await firstValueFrom(service().placeOrder());
      expect(injector.inject(CheckoutAdapter).placeOrder).toHaveBeenCalled();
    });

    it('should return checkout response', async () => {
      const result = await firstValueFrom(service().placeOrder());
      expect(result).toEqual({ orderReference: 'test' });
    });

    it('should redirect to order page', async () => {
      await firstValueFrom(service().placeOrder());
      expect(injector.inject(RouterService).navigate).toHaveBeenCalledWith(
        'order/test'
      );
    });
  });
});
