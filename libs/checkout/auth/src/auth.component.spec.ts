import { fixture } from '@open-wc/testing-helpers';
import { AuthService } from '@spryker-oryx/auth';
import { AuthLoginComponent } from '@spryker-oryx/auth/login';
import { CheckoutDataService } from '@spryker-oryx/checkout';
import { CheckoutGuestComponent } from '@spryker-oryx/checkout/guest';
import { useComponent } from '@spryker-oryx/core/utilities';
import { createInjector, destroyInjector } from '@spryker-oryx/injector';
import { html } from 'lit';
import { of } from 'rxjs';
import { CheckoutAuthComponent } from './auth.component';
import { checkoutAuthComponent } from './auth.def';

class MockAuthService implements Partial<AuthService> {
  isAuthenticated = vi.fn().mockReturnValue(of(false));
}

class MockDataService implements Partial<CheckoutDataService> {
  setIsGuestCheckout = vi.fn();
  isGuestCheckout = vi.fn().mockReturnValue(of(false));
}

describe('Checkout Auth', () => {
  let element: CheckoutAuthComponent;
  let service: MockAuthService;

  beforeAll(async () => {
    await useComponent(checkoutAuthComponent);
  });

  beforeEach(() => {
    const testInjector = createInjector({
      providers: [
        {
          provide: AuthService,
          useClass: MockAuthService,
        },
        {
          provide: CheckoutDataService,
          useClass: MockDataService,
        },
      ],
    });

    service = testInjector.inject(AuthService) as unknown as MockAuthService;
  });

  afterEach(() => {
    destroyInjector();
    vi.clearAllMocks();
  });

  it('passes the a11y audit', async () => {
    element = await fixture(html`<checkout-auth uid="1"></checkout-auth>`);

    await expect(element).shadowDom.to.be.accessible();
  });

  it('should not render children if isAuthenticated is true', async () => {
    service.isAuthenticated.mockReturnValue(of(true));

    element = await fixture(html`<checkout-auth uid="1"></checkout-auth>`);
    const guestCheckoutComponent =
      element.renderRoot.querySelector('checkout-guest');
    const authLoginComponent = element.renderRoot.querySelector('auth-login');

    expect(guestCheckoutComponent).toBe(null);
    expect(authLoginComponent).toBe(null);
  });

  describe('options', () => {
    const mockGuestOptions = {
      guestUrl: 'guestUrl',
    };
    const mockLoginOptions = {
      loginUrl: 'loginUrl',
    };

    it('should split options between checkout-guest and auth-login components', async () => {
      element = await fixture(
        html`<checkout-auth
          uid="1"
          .options=${{ ...mockGuestOptions, ...mockLoginOptions }}
        ></checkout-auth>`
      );
      const guestCheckoutComponent =
        element.renderRoot.querySelector('checkout-guest');
      const authLoginComponent = element.renderRoot.querySelector('auth-login');

      expect(
        (guestCheckoutComponent as CheckoutGuestComponent)?.options
      ).toContain({ url: mockGuestOptions.guestUrl });
      expect((authLoginComponent as AuthLoginComponent)?.options).toContain({
        url: mockLoginOptions.loginUrl,
      });
    });
  });
});
