import { fixture } from '@open-wc/testing-helpers';
import { AuthService } from '@spryker-oryx/auth';
import {
  CheckoutDataService,
  CheckoutForm,
  CheckoutOrchestrationService,
  CheckoutStepType,
  CheckoutTrigger,
} from '@spryker-oryx/checkout';
import { useComponent } from '@spryker-oryx/core/utilities';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { html } from 'lit';
import { BehaviorSubject, of } from 'rxjs';
import {
  MockCheckoutDataService,
  MockCheckoutOrchestrationService,
  mockCheckoutProviders,
} from '../../src/mocks/src';
import { CheckoutDeliveryComponent } from './delivery.component';
import { checkoutDeliveryComponent } from './delivery.def';

describe('CheckoutDeliveryComponent', () => {
  let element: CheckoutDeliveryComponent;
  let orchestrationService: MockCheckoutOrchestrationService;
  let checkoutDataService: MockCheckoutDataService;
  let authService: AuthService;

  beforeAll(async () => {
    await useComponent(checkoutDeliveryComponent);
  });

  beforeEach(async () => {
    const injector = createInjector({
      providers: [...mockCheckoutProviders],
    });

    orchestrationService = injector.inject<MockCheckoutOrchestrationService>(
      CheckoutOrchestrationService
    );
    checkoutDataService =
      injector.inject<MockCheckoutDataService>(CheckoutDataService);

    authService = injector.inject(AuthService);

    element = await fixture(html`<checkout-delivery></checkout-delivery>`);
  });

  afterEach(() => {
    destroyInjector();
    vi.clearAllMocks();
  });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  describe('when user is authenticated', () => {
    beforeEach(async () => {
      authService.isAuthenticated = vi.fn().mockReturnValue(of(true));
      element = await fixture(html`<checkout-delivery></checkout-delivery>`);
    });

    it('should not render contact details', () => {
      expect(element).not.toContainElement('checkout-contact');
    });
  });

  describe('when guest user is supported', () => {
    let contactElement: (HTMLElement & CheckoutForm) | null;
    let addressElement: (HTMLElement & CheckoutForm) | null;
    const subject = new BehaviorSubject<CheckoutTrigger | null>(null);
    beforeEach(async () => {
      orchestrationService.getTrigger = vi.fn().mockReturnValue(subject);
      checkoutDataService.isGuestCheckout.mockReturnValue(of(true));
      // checkoutDataService.isGuestCheckout = vi.fn().mockReturnValue(of(true));
      // orchestrationService.report = vi.fn();
      element = await fixture(html`<checkout-delivery></checkout-delivery>`);
      contactElement = element.renderRoot.querySelector('checkout-contact');
      addressElement = element.renderRoot.querySelector('checkout-address');
      if (contactElement && addressElement) {
        contactElement.submit = vi.fn().mockReturnValue(true);
        addressElement.submit = vi.fn().mockReturnValue(true);
      }
    });

    it('should render contact details', () => {
      expect(element).toContainElement('checkout-contact');
    });

    describe('and the CheckoutTrigger.Report is triggered', () => {
      describe('and both forms are valid', () => {
        beforeEach(async () => {
          subject.next(CheckoutTrigger.Report);
        });

        it('should submit both forms', () => {
          expect(contactElement?.submit).toHaveBeenCalled();
          expect(addressElement?.submit).toHaveBeenCalled();
        });
      });

      describe('and the contact form is invalid', () => {
        beforeEach(async () => {
          if (contactElement) {
            contactElement.submit = vi.fn().mockReturnValue(false);
          }
          subject.next(CheckoutTrigger.Report);
        });

        it('should not submit the address form', () => {
          expect(contactElement?.submit).toHaveBeenCalled();
          expect(addressElement?.submit).not.toHaveBeenCalled();
        });
      });

      it('should not report the form state', () => {
        expect(orchestrationService.report).not.toHaveBeenCalled();
      });

      describe('and the CheckoutTrigger.Check is triggered', () => {
        describe('and both forms are valid', () => {
          beforeEach(async () => {
            subject.next(CheckoutTrigger.Check);
          });

          it('should report the form state', () => {
            expect(orchestrationService.report).toHaveBeenCalledWith(
              CheckoutStepType.Delivery,
              true
            );
          });
        });

        describe('and the contact form is invalid', () => {
          beforeEach(async () => {
            if (contactElement) {
              contactElement.submit = vi.fn().mockReturnValue(false);
            }
            subject.next(CheckoutTrigger.Check);
          });

          it('should report the form state', () => {
            expect(orchestrationService.report).toHaveBeenCalledWith(
              CheckoutStepType.Delivery,
              false
            );
          });
        });
      });
    });
  });
});
