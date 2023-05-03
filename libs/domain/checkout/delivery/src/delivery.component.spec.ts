import { fixture } from '@open-wc/testing-helpers';
import { AuthService } from '@spryker-oryx/auth';
import { CheckoutDataService } from '@spryker-oryx/checkout';
import { useComponent } from '@spryker-oryx/core/utilities';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { AddressService } from '@spryker-oryx/user';
import { html } from 'lit';
import { of } from 'rxjs';
import {
  MockAuthService,
  MockCheckoutDataService,
  MockCheckoutOrchestrationService,
  mockCheckoutProviders,
} from '../../src/mocCheckoutService';
import { CheckoutDeliveryComponent } from './delivery.component';
import { checkoutDeliveryComponent } from './delivery.def';

class MockAddressService implements Partial<AddressService> {
  getAddresses = vi.fn().mockReturnValue(of([]));
}

describe('CheckoutDeliveryComponent', () => {
  let element: CheckoutDeliveryComponent;
  let orchestrationService: MockCheckoutOrchestrationService;
  let checkoutDataService: MockCheckoutDataService;
  let authService: MockAuthService;

  beforeAll(async () => {
    await useComponent(checkoutDeliveryComponent);
  });

  beforeEach(async () => {
    const injector = createInjector({
      providers: [
        ...mockCheckoutProviders,
        {
          provide: AddressService,
          useClass: MockAddressService,
        },
      ],
    });

    orchestrationService = injector.inject<MockCheckoutOrchestrationService>(
      CheckoutOrchestrationService
    );
    checkoutDataService =
      injector.inject<MockCheckoutDataService>(CheckoutDataService);
    authService = injector.inject<MockAuthService>(AuthService);

    element = await fixture(
      html`<oryx-checkout-delivery></oryx-checkout-delivery>`
    );
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
      element = await fixture(
        html`<oryx-checkout-delivery></oryx-checkout-delivery>`
      );
    });

    it('should not render contact details', () => {
      expect(element).not.toContainElement('oryx-checkout-contact');
    });
  });

  // describe('when guest user is supported', () => {
  //   let contactElement: (HTMLElement) | null;
  //   let addressElement: (HTMLElement) | null;
  //   const subject = new BehaviorSubject<CheckoutTrigger | null>(null);
  //   beforeEach(async () => {
  //     orchestrationService.getTrigger.mockReturnValue(subject);
  //     checkoutDataService.isGuestCheckout.mockReturnValue(of(true));
  //     element = await fixture(
  //       html`<oryx-checkout-delivery></oryx-checkout-delivery>`
  //     );
  //     contactElement = element.renderRoot.querySelector(
  //       'oryx-checkout-contact'
  //     );
  //     addressElement = element.renderRoot.querySelector(
  //       'oryx-checkout-address'
  //     );
  //     if (contactElement && addressElement) {
  //       contactElement.submit = vi.fn().mockReturnValue(true);
  //       addressElement.submit = vi.fn().mockReturnValue(true);
  //     }
  //   });

  //   it('should render contact details', () => {
  //     expect(element).toContainElement('oryx-checkout-contact');
  //   });

  //   describe('and the CheckoutTrigger.Report is triggered', () => {
  //     describe('and both forms are valid', () => {
  //       beforeEach(async () => {
  //         subject.next(CheckoutTrigger.Report);
  //       });

  //       it('should submit both forms', () => {
  //         expect(contactElement?.submit).toHaveBeenCalled();
  //         expect(addressElement?.submit).toHaveBeenCalled();
  //       });
  //     });

  //     describe('and the contact form is invalid', () => {
  //       beforeEach(async () => {
  //         if (contactElement) {
  //           contactElement.submit = vi.fn().mockReturnValue(false);
  //         }
  //         subject.next(CheckoutTrigger.Report);
  //       });

  //       it('should not submit the address form', () => {
  //         expect(contactElement?.submit).toHaveBeenCalled();
  //         expect(addressElement?.submit).not.toHaveBeenCalled();
  //       });
  //     });

  //     it('should not report the form state', () => {
  //       expect(orchestrationService.report).not.toHaveBeenCalled();
  //     });

  //     describe('and the CheckoutTrigger.Check is triggered', () => {
  //       describe('and both forms are valid', () => {
  //         beforeEach(async () => {
  //           subject.next(CheckoutTrigger.Check);
  //         });

  //         it('should report the form state', () => {
  //           expect(orchestrationService.report).toHaveBeenCalledWith(
  //             CheckoutStepType.Delivery,
  //             true
  //           );
  //         });
  //       });

  //       describe('and the contact form is invalid', () => {
  //         beforeEach(async () => {
  //           if (contactElement) {
  //             contactElement.submit = vi.fn().mockReturnValue(false);
  //           }
  //           subject.next(CheckoutTrigger.Check);
  //         });

  //         it('should report the form state', () => {
  //           expect(orchestrationService.report).toHaveBeenCalledWith(
  //             CheckoutStepType.Delivery,
  //             false
  //           );
  //         });
  //       });
  //     });
  //   });
  // });
});
