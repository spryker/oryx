import { fixture } from '@open-wc/testing-helpers';
import { CartService } from '@spryker-oryx/cart';
import {
  CheckoutDataService,
  CheckoutService,
  CheckoutState,
  CheckoutStateService,
  isValid,
} from '@spryker-oryx/checkout';
import { useComponent } from '@spryker-oryx/core/utilities';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { html, LitElement, TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';
import { BehaviorSubject, of } from 'rxjs';
import { CheckoutComponent } from './checkout.component';
import { checkoutComponent } from './checkout.def';

class MockCartService implements Partial<CartService> {
  getCart = vi.fn().mockReturnValue(of({ id: '123' }));
}

export class MockCheckoutService implements Partial<CheckoutService> {
  getProcessState = vi.fn().mockReturnValue(of());
}

export class MockCheckoutDataService implements Partial<CheckoutDataService> {
  get = vi.fn();
}

export class MockCheckoutStateService implements Partial<CheckoutStateService> {
  get = vi.fn();
  set = vi.fn();
}

const mockReport = vi.fn();

@customElement('mock-component')
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class MockComponent extends LitElement implements isValid {
  isValid = mockReport;
}

@customElement('experience-composition')
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class MockComposition extends LitElement {
  render(): TemplateResult {
    return html`<mock-component></mock-component
      ><mock-component></mock-component><mock-component></mock-component>`;
  }
}

describe('CheckoutOrchestratorComponent', () => {
  let element: CheckoutComponent;
  let checkoutService: MockCheckoutService;

  beforeAll(async () => {
    await useComponent(checkoutComponent);
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
  });

  afterEach(() => {
    destroyInjector();
    vi.clearAllMocks();
  });

  describe('when the component is created', () => {
    beforeEach(async () => {
      element = await fixture(html`<oryx-checkout></oryx-checkout>`);
    });

    it('should be an instance of ', () => {
      expect(element).toBeInstanceOf(CheckoutComponent);
    });

    it('should pass the a11y audit', async () => {
      await expect(element).shadowDom.to.be.accessible();
    });
  });

  describe('when the checkout is not available', () => {
    beforeEach(async () => {
      checkoutService.getProcessState.mockReturnValue(of(CheckoutState.Empty));
      element = await fixture(html`<oryx-checkout></oryx-checkout>`);
    });

    it('should not render the oryx-composition', () => {
      expect(element).not.toContainElement('experience-composition');
    });
  });

  describe('when the checkout is Ready', () => {
    beforeEach(async () => {
      checkoutService.getProcessState.mockReturnValue(of(CheckoutState.Ready));
      element = await fixture(html`<oryx-checkout></oryx-checkout>`);
    });

    it('should render the oryx-composition', () => {
      expect(element).toContainElement('experience-composition');
    });
  });

  describe('when the checkout is Busy', () => {
    beforeEach(async () => {
      checkoutService.getProcessState.mockReturnValue(of(CheckoutState.Busy));
      element = await fixture(html`<oryx-checkout></oryx-checkout>`);
    });

    it('should render the oryx-composition', () => {
      expect(element).toContainElement('experience-composition');
    });
  });

  describe('when the checkout is ready', () => {
    describe('and the checkout forms are valid', () => {
      beforeEach(async () => {
        mockReport.mockReturnValue(true);
      });

      const state = new BehaviorSubject(CheckoutState.Ready);

      beforeEach(async () => {
        checkoutService.getProcessState.mockReturnValue(state);
        element = await fixture(html`<oryx-checkout></oryx-checkout>`);
      });

      describe('and the state becomes invalid', () => {
        beforeEach(async () => {
          state.next(CheckoutState.Invalid);
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

      const state = new BehaviorSubject(CheckoutState.Ready);

      beforeEach(async () => {
        checkoutService.getProcessState.mockReturnValue(state);
        element = await fixture(html`<oryx-checkout></oryx-checkout>`);
      });

      describe('and the state becomes invalid', () => {
        beforeEach(async () => {
          state.next(CheckoutState.Invalid);
        });

        it('should report validity on the first component', () => {
          expect(mockReport).toHaveBeenCalledTimes(1);
        });
      });
    });
  });
});
