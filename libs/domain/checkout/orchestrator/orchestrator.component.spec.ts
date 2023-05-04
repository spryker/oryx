import { fixture } from '@open-wc/testing-helpers';
import { CartService } from '@spryker-oryx/cart';
import {
  CheckoutProcessState,
  CheckoutService,
  CheckoutStepCallback,
} from '@spryker-oryx/checkout';
import { useComponent } from '@spryker-oryx/core/utilities';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { html } from 'lit';
import { Observable, of, take } from 'rxjs';
import { mockCheckoutProviders, MockCheckoutService } from '../src/mocks/src';

import { CheckoutOrchestratorComponent } from './orchestrator.component';
import { checkoutOrchestratorComponent } from './orchestrator.def';

class MockCartService implements Partial<CartService> {
  getCart = vi.fn().mockReturnValue(of({ id: '123' }));
}

describe('CheckoutOrchestratorComponent', () => {
  let element: CheckoutOrchestratorComponent;
  let checkoutService: MockCheckoutService;
  let cartService: MockCartService;
  let callback: () => Observable<unknown>;

  beforeAll(async () => {
    await useComponent(checkoutOrchestratorComponent);
  });

  beforeEach(async () => {
    const injector = createInjector({
      providers: [
        ...mockCheckoutProviders,
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
      expect(element).toBeInstanceOf(CheckoutOrchestratorComponent);
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
        of(CheckoutProcessState.NotAvailable)
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
      checkoutService.getProcessState.mockReturnValue(
        of(CheckoutProcessState.Ready)
      );
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
