import { fixture } from '@open-wc/testing-helpers';
import { AuthService } from '@spryker-oryx/auth';
import { useComponent } from '@spryker-oryx/core/utilities';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { RouterService } from '@spryker-oryx/router';
import { SemanticLinkService } from '@spryker-oryx/site';
import { html } from 'lit';
import { of } from 'rxjs';
import { mockCheckoutProviders } from '../src/mocks/src';
import { CheckoutDataService } from '../src/services';
import { CheckoutGuestComponent } from './guest.component';
import { checkoutGuestComponent } from './guest.def';

const mockLink = '/semanticLink';

describe('Checkout Guest', () => {
  let element: CheckoutGuestComponent;
  let routerService: RouterService;
  let linkService: SemanticLinkService;
  let checkoutDataService: CheckoutDataService;
  let authService: AuthService;

  beforeAll(async () => {
    await useComponent(checkoutGuestComponent);
  });

  beforeEach(() => {
    const testInjector = createInjector({
      providers: [...mockCheckoutProviders],
    });

    routerService = testInjector.inject(RouterService);
    checkoutDataService = testInjector.inject(CheckoutDataService);
    authService = testInjector.inject(AuthService);
    linkService = testInjector.inject(SemanticLinkService);
    // linkService.get = vi.fn().mockReturnValue(of(mockLink));
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
      linkService.get = vi.fn().mockReturnValue(of(mockLink));
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

    it('should redirect to the checkout login page', () => {
      expect(routerService.navigate).not.toHaveBeenCalled();
    });
  });

  describe('when the user is authenticated', () => {
    beforeEach(async () => {
      authService.isAuthenticated = vi.fn().mockReturnValue(of(true));
      linkService.get = vi.fn().mockReturnValue(of(mockLink));
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
