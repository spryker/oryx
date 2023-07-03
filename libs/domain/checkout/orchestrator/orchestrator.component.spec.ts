import { fixture } from '@open-wc/testing-helpers';
import { CartService } from '@spryker-oryx/cart';
import {
  CheckoutDataService,
  CheckoutService,
  CheckoutStateService,
  CheckoutStatus,
  isValid,
} from '@spryker-oryx/checkout';
import { useComponent } from '@spryker-oryx/core/utilities';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { html, LitElement, TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';
import { BehaviorSubject, of } from 'rxjs';
import { CheckoutOrchestratorComponent } from './orchestrator.component';
import { checkoutOrchestratorComponent } from './orchestrator.def';

class MockCartService implements Partial<CartService> {
  getCart = vi.fn().mockReturnValue(of({ id: '123' }));
}

export class MockCheckoutService implements Partial<CheckoutService> {
  getStatus = vi.fn().mockReturnValue(of());
}

export class MockCheckoutDataService implements Partial<CheckoutDataService> {
  get = vi.fn();
}

export class MockCheckoutStateService implements Partial<CheckoutStateService> {
  get = vi.fn();
  set = vi.fn();
  isInvalid = vi.fn().mockReturnValue(of(false));
}

const mockReport = vi.fn();

@customElement('mock-component')
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class MockComponent extends LitElement implements isValid {
  isValid = mockReport;
}

@customElement('oryx-composition')
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class MockComposition extends LitElement {
  render(): TemplateResult {
    return html`<mock-component></mock-component
      ><mock-component></mock-component><mock-component></mock-component>`;
  }
}

describe('CheckoutOrchestratorComponent', () => {
  let element: CheckoutOrchestratorComponent;
  let checkoutService: MockCheckoutService;
  let checkoutStateService: MockCheckoutStateService;

  beforeAll(async () => {
    await useComponent(checkoutOrchestratorComponent);
  });

  beforeEach(async () => {
    const injector = createInjector({
      providers: [
        { provide: CheckoutService, useClass: MockCheckoutService },
        { provide: CheckoutDataService, useClass: MockCheckoutDataService },
        { provide: CheckoutStateService, useClass: MockCheckoutStateService },
        { provide: CartService, useClass: MockCartService },
      ],
    });

    checkoutService = injector.inject<MockCheckoutService>(CheckoutService);
    checkoutStateService =
      injector.inject<MockCheckoutStateService>(CheckoutStateService);
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
  });

  describe('when the checkout is not available', () => {
    beforeEach(async () => {
      checkoutService.getStatus.mockReturnValue(of(CheckoutStatus.Empty));
      element = await fixture(
        html`<oryx-checkout-orchestrator></oryx-checkout-orchestrator>`
      );
    });

    it('should not render the oryx-composition', () => {
      expect(element).not.toContainElement('oryx-composition');
    });
  });

  describe('when the checkout is Ready', () => {
    beforeEach(async () => {
      checkoutService.getStatus.mockReturnValue(of(CheckoutStatus.Ready));
      element = await fixture(
        html`<oryx-checkout-orchestrator></oryx-checkout-orchestrator>`
      );
    });

    it('should render the oryx-composition', () => {
      expect(element).toContainElement('oryx-composition');
    });
  });

  describe('when the checkout is Busy', () => {
    beforeEach(async () => {
      checkoutService.getStatus.mockReturnValue(of(CheckoutStatus.Busy));
      element = await fixture(
        html`<oryx-checkout-orchestrator></oryx-checkout-orchestrator>`
      );
    });

    it('should render the oryx-composition', () => {
      expect(element).toContainElement('oryx-composition');
    });
  });

  describe('when the checkout is ready', () => {
    describe('and the checkout forms are valid', () => {
      beforeEach(async () => {
        mockReport.mockReturnValue(true);
      });

      const isInvalidState = new BehaviorSubject(false);

      beforeEach(async () => {
        checkoutStateService.isInvalid.mockReturnValue(isInvalidState);
        element = await fixture(
          html`<oryx-checkout-orchestrator></oryx-checkout-orchestrator>`
        );
      });

      describe('and the state becomes invalid', () => {
        beforeEach(async () => {
          isInvalidState.next(true);
        });

        it('should report validity on all the components', () => {
          expect(mockReport).toHaveBeenCalledTimes(3);
        });
      });
    });

    describe('and the checkout forms are invalid', () => {
      beforeEach(async () => {
        mockReport.mockReturnValue(false);
      });

      const isInvalidState = new BehaviorSubject(false);

      beforeEach(async () => {
        checkoutStateService.isInvalid.mockReturnValue(isInvalidState);
        element = await fixture(
          html`<oryx-checkout-orchestrator></oryx-checkout-orchestrator>`
        );
      });

      describe('and the state becomes invalid', () => {
        beforeEach(async () => {
          isInvalidState.next(true);
        });

        it('should report validity on the first component', () => {
          expect(mockReport).toHaveBeenCalledTimes(1);
        });
      });
    });
  });
});
