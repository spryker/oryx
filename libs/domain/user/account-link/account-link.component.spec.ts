import { fixture } from '@open-wc/testing-helpers';
import { AuthService } from '@spryker-oryx/auth';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { useComponent } from '@spryker-oryx/utilities';
import { html } from 'lit';
import { of } from 'rxjs';
import { AccountLinkComponent } from './account-link.component';
import { accountLinkComponent } from './account-link.def';

class MockAuthService implements Partial<AuthService> {
  isAuthenticated = vi.fn().mockReturnValue(of(true));
}

describe('AccountLinkComponent', () => {
  let element: AccountLinkComponent;
  let authService: MockAuthService;

  beforeAll(async () => {
    await useComponent(accountLinkComponent);
  });

  beforeEach(async () => {
    const testInjector = createInjector({
      providers: [
        {
          provide: AuthService,
          useClass: MockAuthService,
        },
      ],
    });

    authService = testInjector.inject(
      AuthService
    ) as unknown as MockAuthService;

    element = await fixture(
      html`<oryx-user-account-link></oryx-user-account-link>`
    );
  });

  afterEach(() => {
    vi.clearAllMocks();
    destroyInjector();
  });

  it('should be defined', () => {
    expect(element).toBeInstanceOf(AccountLinkComponent);
  });

  it('should pass the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  describe('when user is authenticated', () => {
    it('should render contents', () => {
      expect(element.renderRoot.querySelector('oryx-button')).not.toBeNull();
    });
  });

  describe('when user is not authenticated', () => {
    beforeEach(async () => {
      authService.isAuthenticated.mockReturnValue(of(false));

      element = await fixture(
        html`<oryx-user-account-link></oryx-user-account-link>`
      );
    });

    it('should not render contents', () => {
      expect(element.renderRoot.querySelector('oryx-button')).toBeNull();
    });
  });
});
