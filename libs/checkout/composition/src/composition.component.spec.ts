import { fixture } from '@open-wc/testing-helpers';
import { AuthService } from '@spryker-oryx/auth';
import { CartService } from '@spryker-oryx/cart';
import {
  CheckoutDataService,
  CheckoutOrchestrationService,
} from '@spryker-oryx/checkout';
import { useComponent } from '@spryker-oryx/core/utilities';
import { createInjector, destroyInjector } from '@spryker-oryx/injector';
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

describe('CheckoutCompositionComponent', () => {
  let element: CheckoutCompositionComponent;
  let cartService: MockCartService;

  beforeAll(async () => {
    await useComponent(checkoutCompositionComponent);
  });

  beforeEach(async () => {
    const testInjector = createInjector({
      providers: [
        {
          provide: CartService,
          useClass: MockCartService,
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

    cartService = testInjector.inject(
      CartService
    ) as unknown as MockCartService;

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

  // describe('when cart is empty', () => {
  //   beforeEach(async () => {
  //     element = await fixture(
  //       html`<oryx-checkout-composition></oryx-checkout-composition>`
  //     );
  //   });
  //   it('should not render content', () => {
  //     expect(element.renderRoot.children.length).toBe(0);
  //   });
  // });
});
