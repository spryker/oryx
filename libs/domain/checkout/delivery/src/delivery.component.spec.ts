import { fixture } from '@open-wc/testing-helpers';
import { AuthService } from '@spryker-oryx/auth';
import {
  CheckoutForm,
  CheckoutOrchestrationService,
  CheckoutStepType,
  CheckoutTrigger,
} from '@spryker-oryx/checkout';
import { useComponent } from '@spryker-oryx/core/utilities';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { html, LitElement, TemplateResult } from 'lit';
import { BehaviorSubject, of } from 'rxjs';
import { CheckoutDeliveryComponent } from './delivery.component';
import { checkoutDeliveryComponent } from './delivery.def';

class MockCheckoutOrchestrationService
  implements Partial<CheckoutOrchestrationService>
{
  trigger$ = new BehaviorSubject<any>(null);
  getTrigger = vi.fn().mockReturnValue(this.trigger$);
  report = vi.fn();
  submit = vi.fn();
}

class MockAuthService implements Partial<AuthService> {
  isAuthenticated = vi.fn().mockReturnValue(of(false));
}

const setupFakeComponents = (): void => {
  class FakeComponent extends LitElement implements CheckoutForm {
    submit = vi.fn().mockReturnValue(true);

    render(): TemplateResult {
      return html``;
    }
  }

  customElements.define('checkout-contact', FakeComponent);

  customElements.define('checkout-address', class extends FakeComponent {});
};

type FormElement = LitElement & CheckoutForm;

describe('CheckoutDeliveryComponent', () => {
  let element: CheckoutDeliveryComponent;
  let orchestrationService: MockCheckoutOrchestrationService;
  let authService: MockAuthService;
  let contactElement: FormElement;
  let addressElement: FormElement;

  setupFakeComponents();

  beforeAll(async () => {
    await useComponent(checkoutDeliveryComponent);
  });

  beforeEach(async () => {
    const testInjector = createInjector({
      providers: [
        {
          provide: AuthService,
          useClass: MockAuthService,
        },
        {
          provide: CheckoutOrchestrationService,
          useClass: MockCheckoutOrchestrationService,
        },
      ],
    });

    orchestrationService = testInjector.inject(
      CheckoutOrchestrationService
    ) as unknown as MockCheckoutOrchestrationService;

    authService = testInjector.inject(
      AuthService
    ) as unknown as MockAuthService;

    element = await fixture(html`<checkout-delivery></checkout-delivery>`);
  });

  afterEach(() => {
    destroyInjector();
    vi.clearAllMocks();
  });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  describe('when user is authorized', () => {
    beforeEach(async () => {
      authService.isAuthenticated.mockReturnValue(of(true));

      element = await fixture(html`<checkout-delivery></checkout-delivery>`);
    });

    it('should not render contact details', () => {
      expect(element).not.toContainElement('checkout-contact');
    });
  });

  describe('when check is triggered', () => {
    beforeEach(async () => {
      element = await fixture(html`<checkout-delivery></checkout-delivery>`);

      contactElement = element.renderRoot.querySelector(
        'checkout-contact'
      ) as FormElement;
      addressElement = element.renderRoot.querySelector(
        'checkout-address'
      ) as FormElement;

      orchestrationService.trigger$.next(CheckoutTrigger.Check);
    });

    it('should check forms validity', () => {
      expect(contactElement.submit).toHaveBeenCalled();
      expect(addressElement.submit).toHaveBeenCalled();
    });

    it('should report valid state', () => {
      expect(orchestrationService.report).toHaveBeenCalledWith(
        CheckoutStepType.Delivery,
        true
      );
    });

    describe('and first form is invalid', () => {
      beforeEach(async () => {
        element = await fixture(html`<checkout-delivery></checkout-delivery>`);

        contactElement = element.renderRoot.querySelector(
          'checkout-contact'
        ) as FormElement;
        contactElement.submit = vi.fn().mockReturnValue(false);

        orchestrationService.trigger$.next(CheckoutTrigger.Check);
      });

      it('should report invalid state', () => {
        expect(orchestrationService.report).toHaveBeenCalledWith(
          CheckoutStepType.Delivery,
          false
        );
      });
    });
  });

  describe('when report is triggered', () => {
    beforeEach(async () => {
      element = await fixture(html`<checkout-delivery></checkout-delivery>`);

      contactElement = element.renderRoot.querySelector(
        'checkout-contact'
      ) as FormElement;
      addressElement = element.renderRoot.querySelector(
        'checkout-address'
      ) as FormElement;

      orchestrationService.trigger$.next(CheckoutTrigger.Report);
    });

    it('should submit the forms with param', () => {
      expect(contactElement.submit).toHaveBeenCalledWith(true);
      expect(addressElement.submit).toHaveBeenCalledWith(true);
    });

    describe('and first form is invalid', () => {
      beforeEach(async () => {
        element = await fixture(html`<checkout-delivery></checkout-delivery>`);

        contactElement = element.renderRoot.querySelector(
          'checkout-contact'
        ) as FormElement;
        addressElement = element.renderRoot.querySelector(
          'checkout-address'
        ) as FormElement;
        contactElement.submit = vi.fn().mockReturnValue(false);

        orchestrationService.trigger$.next(CheckoutTrigger.Report);
      });

      it('should submit only the first form', () => {
        expect(contactElement.submit).toHaveBeenCalled();
        expect(addressElement.submit).not.toHaveBeenCalled();
      });
    });
  });

  describe('when submit address button is clicked', () => {
    beforeEach(async () => {
      element = await fixture(html`<checkout-delivery></checkout-delivery>`);

      (
        element.renderRoot.querySelector('button') as HTMLButtonElement
      ).dispatchEvent(new MouseEvent('click'));
    });

    it('should perform submit with step name', () => {
      expect(orchestrationService.submit).toHaveBeenCalledWith(
        CheckoutStepType.Delivery
      );
    });
  });
});
