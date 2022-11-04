import { fixture } from '@open-wc/testing-helpers';
import { AuthService } from '@spryker-oryx/auth';
import { AuthLoginComponent } from '@spryker-oryx/auth/login';
import { CheckoutGuestComponent } from '@spryker-oryx/checkout/guest';
import { useComponent } from '@spryker-oryx/core/utilities';
import { createInjector, destroyInjector } from '@spryker-oryx/injector';
import { html } from 'lit';
import { of } from 'rxjs';
import { CheckoutLoginComponent } from './login.component';
import { checkoutLoginComponent } from './login.def';

class MockAuthService implements Partial<AuthService> {
  isAuthenticated = vi.fn().mockReturnValue(of(false));
}

describe('Checkout Login', () => {
  let element: CheckoutLoginComponent;
  let service: MockAuthService;

  beforeAll(async () => {
    await useComponent(checkoutLoginComponent);
  });

  beforeEach(() => {
    const testInjector = createInjector({
      providers: [
        {
          provide: AuthService,
          useClass: MockAuthService,
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
    element = await fixture(html`<checkout-login uid="1"></checkout-login>`);

    await expect(element).shadowDom.to.be.accessible();
  });

  it('should not render children if isAuthenticated is true', async () => {
    service.isAuthenticated.mockReturnValue(of(true));

    element = await fixture(html`<checkout-login uid="1"></checkout-login>`);
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
        html`<checkout-login
          uid="1"
          .options=${{ ...mockGuestOptions, ...mockLoginOptions }}
        ></checkout-login>`
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
