import { fixture } from '@open-wc/testing-helpers';
import { AuthService } from '@spryker-oryx/auth';
import { CartService } from '@spryker-oryx/cart';
import {
  CheckoutDataService,
  CheckoutOrchestrationService,
} from '@spryker-oryx/checkout';
import { useComponent } from '@spryker-oryx/core/utilities';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { AddressService } from '@spryker-oryx/user';
import { html } from 'lit';
import { of } from 'rxjs';
import { CheckoutCompositionComponent } from './composition.component';
import { checkoutCompositionComponent } from './composition.def';

class MockCartService implements Partial<CartService> {
  isEmpty = vi.fn().mockReturnValue(of(true));
}

class MockCheckoutDataService implements Partial<CheckoutDataService> {
  isGuestCheckout = vi.fn().mockReturnValue(of(false));
  setIsGuestCheckout = vi.fn();

  getContactDetails = vi.fn().mockReturnValue(of({}));
  getAddressDetails = vi.fn().mockReturnValue(of({}));
}

class MockCheckoutOrchestrationService
  implements Partial<CheckoutOrchestrationService>
{
  getValidity = vi.fn().mockReturnValue(of([{}]));
}

class MockAuthService implements Partial<AuthService> {
  isAuthenticated = vi.fn().mockReturnValue(of(false));
}

class MockAddressService implements Partial<AddressService> {
  getAddresses = vi.fn().mockReturnValue(of(null));
}

describe('CheckoutCompositionComponent', () => {
  let element: CheckoutCompositionComponent;

  beforeAll(async () => {
    await useComponent(checkoutCompositionComponent);
  });

  beforeEach(async () => {
    createInjector({
      providers: [
        {
          provide: CartService,
          useClass: MockCartService,
        },
        {
          provide: AddressService,
          useClass: MockAddressService,
        },
        {
          provide: CheckoutDataService,
          useClass: MockCheckoutDataService,
        },
        {
          provide: CheckoutOrchestrationService,
          useClass: MockCheckoutOrchestrationService,
        },
        {
          provide: AuthService,
          useClass: MockAuthService,
        },
      ],
    });

    element = await fixture(
      html`<oryx-checkout-composition></oryx-checkout-composition>`
    );
  });

  afterEach(() => {
    destroyInjector();
    vi.clearAllMocks();
  });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
