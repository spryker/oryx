import { fixture } from '@open-wc/testing-helpers';
import { AuthService } from '@spryker-oryx/auth';
import { useComponent } from '@spryker-oryx/core/utilities';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { RouterService } from '@spryker-oryx/router';
import { SemanticLinkService } from '@spryker-oryx/site';
import { html } from 'lit';
import { of } from 'rxjs';
import { CheckoutDataService } from '../src/services';
import { CheckoutGuestComponent } from './guest.component';
import { checkoutGuestComponent } from './guest.def';

class MockRouterService implements Partial<RouterService> {
  navigate = vi.fn();
}

const mockLink = '/semanticLink';
class MockSemanticLinkService implements Partial<SemanticLinkService> {
  get = vi.fn().mockReturnValue(of(mockLink));
}

class MockCheckoutDataService implements Partial<CheckoutDataService> {
  isGuestCheckout = vi.fn().mockReturnValue(of(false));
  setGuestCheckout = vi.fn();

  getContactDetails = vi.fn().mockReturnValue(of({}));
  getAddressDetails = vi.fn().mockReturnValue(of({}));
}

class MockAuthService implements Partial<AuthService> {
  isAuthenticated = vi.fn().mockReturnValue(of(false));
}

describe('Checkout Guest', () => {
  let element: CheckoutGuestComponent;
  let routerService: MockRouterService;
  let checkoutDataService: MockCheckoutDataService;
  let authService: MockAuthService;

  beforeAll(async () => {
    await useComponent(checkoutGuestComponent);
  });

  beforeEach(() => {
    const testInjector = createInjector({
      providers: [
        {
          provide: RouterService,
          useClass: MockRouterService,
        },
        {
          provide: SemanticLinkService,
          useClass: MockSemanticLinkService,
        },
        {
          provide: CheckoutDataService,
          useClass: MockCheckoutDataService,
        },
        {
          provide: AuthService,
          useClass: MockAuthService,
        },
      ],
    });

    routerService = testInjector.inject(
      RouterService
    ) as unknown as MockRouterService;

    checkoutDataService = testInjector.inject(
      CheckoutDataService
    ) as unknown as MockCheckoutDataService;

    authService = testInjector.inject(
      AuthService
    ) as unknown as MockAuthService;
  });

  afterEach(() => {
    destroyInjector();
    vi.clearAllMocks();
  });

  it('passes the a11y audit', async () => {
    element = await fixture(html`<oryx-checkout-guest></oryx-checkout-guest>`);
    await expect(element).shadowDom.to.be.accessible();
  });

  describe('when the isGuestCheckout() emits true', () => {
    beforeEach(async () => {
      checkoutDataService.isGuestCheckout = vi.fn().mockReturnValue(of(true));
      element = await fixture(
        html`<oryx-checkout-guest></oryx-checkout-guest>`
      );
    });

    it('should redirect to the checkout page', () => {
      expect(routerService.navigate).toHaveBeenCalledWith(mockLink);
    });
  });

  describe('when the isGuestCheckout() emits false', () => {
    beforeEach(async () => {
      checkoutDataService.isGuestCheckout = vi.fn().mockReturnValue(of(false));
      element = await fixture(
        html`<oryx-checkout-guest></oryx-checkout-guest>`
      );
    });

    it('should not redirect to the checkout page', () => {
      expect(routerService.navigate).not.toHaveBeenCalled();
    });
  });

  describe('when the user is authenticated', () => {
    beforeEach(async () => {
      authService.isAuthenticated = vi.fn().mockReturnValue(of(true));
      element = await fixture(
        html`<oryx-checkout-guest></oryx-checkout-guest>`
      );
    });

    it('should redirect to the checkout page', () => {
      expect(routerService.navigate).toHaveBeenCalledWith(mockLink);
    });
  });

  describe('when the link is clicked', () => {
    beforeEach(async () => {
      checkoutDataService.isGuestCheckout = vi.fn().mockReturnValue(of(false));
      element = await fixture(
        html`<oryx-checkout-guest></oryx-checkout-guest>`
      );
      element.shadowRoot?.querySelector('a')?.click();
    });

    it('should set guest checkout to true', () => {
      expect(checkoutDataService.setGuestCheckout).toHaveBeenCalledWith(true);
    });
  });
});
