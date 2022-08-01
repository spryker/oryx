import { fixture, oneEvent } from '@open-wc/testing-helpers';
import { AuthService } from '@spryker-oryx/core';
import { ExperienceService, RouterService } from '@spryker-oryx/experience';
import { createInjector, destroyInjector } from '@spryker-oryx/injector';
import '@spryker-oryx/testing';
import { html } from 'lit';
import { BehaviorSubject, of } from 'rxjs';
import '../index';
import { UserLogoutComponent } from './logout.component';

class MockExperienceService implements Partial<ExperienceService> {
  getOptions = vi.fn();
}
const mockIsAuthenticated = new BehaviorSubject(true);
class MockAuthService implements Partial<AuthService> {
  logout = vi.fn();
  isAuthenticated = () => mockIsAuthenticated;
}

class MockRouterService implements Partial<RouterService> {
  back = vi.fn();
  navigate = vi.fn();
}

describe('User Login', () => {
  let element: UserLogoutComponent;
  let authService: MockAuthService;
  let routerService: MockRouterService;

  beforeEach(() => {
    const testInjector = createInjector({
      providers: [
        {
          provide: ExperienceService,
          useClass: MockExperienceService,
        },
        {
          provide: AuthService,
          useClass: MockAuthService,
        },
        {
          provide: RouterService,
          useClass: MockRouterService,
        },
      ],
    });

    authService = testInjector.inject(
      AuthService
    ) as unknown as MockAuthService;
    routerService = testInjector.inject(
      RouterService
    ) as unknown as MockRouterService;

    mockIsAuthenticated.next(true);
  });

  afterEach(() => {
    destroyInjector();
  });

  describe('default component', () => {
    beforeEach(async () => {
      element = await fixture(html`<user-logout></user-logout>`);
    });

    it('is defined', () => {
      expect(element).toBeInstanceOf(UserLogoutComponent);
    });

    it('passes the a11y audit', async () => {
      await expect(element).shadowDom.to.be.accessible();
    });

    it('renders button', async () => {
      expect(element?.shadowRoot?.querySelector('oryx-button')).toBeDefined();
    });

    describe('when is not authenticated', () => {
      beforeEach(() => {
        mockIsAuthenticated.next(false);
      });

      it('should not renders button', async () => {
        expect(element?.shadowRoot?.querySelector('oryx-button')).toBeNull();
      });
    });
  });

  describe('logout', () => {
    const emmitLogoutClick = async (): Promise<void> => {
      const submit = element?.shadowRoot?.querySelector(
        'oryx-button'
      ) as HTMLButtonElement;
      setTimeout(() => {
        submit.click();
      }, 0);

      await oneEvent(submit, 'click');
    };

    beforeEach(async () => {
      mockIsAuthenticated.next(true);
      element = await fixture(html`<user-logout></user-logout>`);
    });

    it('should call logout on click with default navigate', async () => {
      authService.logout.mockReturnValue(of(null));
      await emmitLogoutClick();
      expect(authService.logout).toHaveBeenCalled();
      expect(routerService.navigate).toHaveBeenCalledWith('');
    });

    describe('when custom redirect has been provided', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<user-logout
            .options="${{
              customRedirect: 'contact',
            }}"
          ></user-logout>`
        );
      });

      it('should call logout on click with custom navigate', async () => {
        authService.logout.mockReturnValue(of(null));
        await emmitLogoutClick();
        expect(authService.logout).toHaveBeenCalled();
        expect(routerService.navigate).toHaveBeenCalledWith('/contact');
      });
    });
  });
});
