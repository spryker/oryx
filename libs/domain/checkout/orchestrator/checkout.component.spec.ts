import { fixture } from '@open-wc/testing-helpers';
import { CartService } from '@spryker-oryx/cart';
import {
  CheckoutService,
  CheckoutState,
  CheckoutStepCallback,
} from '@spryker-oryx/checkout';
import { useComponent } from '@spryker-oryx/core/utilities';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { html } from 'lit';
import { Observable, of, take } from 'rxjs';

import { CheckoutComponent } from './checkout.component';
import { checkoutComponent } from './checkout.def';

class MockCartService implements Partial<CartService> {
  getCart = vi.fn().mockReturnValue(of({ id: '123' }));
}

export class MockCheckoutService implements Partial<CheckoutService> {
  register = vi.fn();
  getProcessState = vi.fn().mockReturnValue(of(CheckoutState.Initializing));
}

describe('CheckoutOrchestratorComponent', () => {
  let element: CheckoutComponent;
  let checkoutService: MockCheckoutService;
  let cartService: MockCartService;
  let callback: () => Observable<unknown>;

  beforeAll(async () => {
    await useComponent(checkoutComponent);
  });

  beforeEach(async () => {
    const injector = createInjector({
      providers: [
        {
          provide: CheckoutService,
          useClass: MockCheckoutService,
        },
        {
          provide: CartService,
          useClass: MockCartService,
        },
      ],
    });

    cartService = injector.inject<MockCartService>(CartService);
    checkoutService = injector.inject<MockCheckoutService>(CheckoutService);
    checkoutService.register.mockImplementation(
      (param: CheckoutStepCallback<unknown>) =>
        (callback = param.collectDataCallback)
    );
  });

  afterEach(() => {
    destroyInjector();
    vi.clearAllMocks();
  });

  describe('when the component is created', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-checkout-orchestrator></oryx-checkout-orchestrator>`
      );
    });

    it('should be an instance of ', () => {
      expect(element).toBeInstanceOf(CheckoutComponent);
    });

    it('should pass the a11y audit', async () => {
      await expect(element).shadowDom.to.be.accessible();
    });

    it('should register the step at the checkout service', () => {
      expect(checkoutService.register).toHaveBeenCalledWith({
        id: 'cartId',
        collectDataCallback: expect.anything(),
      } as CheckoutStepCallback<unknown>);
    });
  });

  describe('when the checkout is not available', () => {
    beforeEach(async () => {
      checkoutService.getProcessState.mockReturnValue(
        of(CheckoutState.NotAvailable)
      );
      element = await fixture(
        html`<oryx-checkout-orchestrator></oryx-checkout-orchestrator>`
      );
    });

    it('should not render the oryx-composition', () => {
      expect(element).not.toContainElement('experience-composition');
    });
  });

  describe('when the checkout is available', () => {
    beforeEach(async () => {
      checkoutService.getProcessState.mockReturnValue(of(CheckoutState.Ready));
      element = await fixture(
        html`<oryx-checkout-orchestrator></oryx-checkout-orchestrator>`
      );
    });

    it('should render the oryx-composition', () => {
      expect(element).toContainElement('experience-composition');
    });
  });

  describe('when the collect callback is called', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-checkout-orchestrator></oryx-checkout-orchestrator>`
      );
      callback().pipe(take(1)).subscribe();
    });

    it('should collect the address', () => {
      expect(cartService.getCart).toHaveBeenCalled();
    });
  });
});
