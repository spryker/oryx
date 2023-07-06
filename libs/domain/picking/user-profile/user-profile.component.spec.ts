import { fixture } from '@open-wc/testing-helpers';
import { AuthService } from '@spryker-oryx/auth';
import { App, AppRef } from '@spryker-oryx/core';
import { useComponent } from '@spryker-oryx/core/utilities';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { SyncSchedulerService } from '@spryker-oryx/offline';
import { RouterService } from '@spryker-oryx/router';
import { nextTick } from '@spryker-oryx/utilities';
import { html } from 'lit';
import { of, switchMap } from 'rxjs';
import { UserProfileComponent } from './user-profile.component';
import { userProfileComponent } from './user-profile.def';

const mockOfflineDataPlugin = {
  refreshData: vi.fn().mockReturnValue(
    of(undefined).pipe(
      switchMap(async () => {
        await nextTick(2);
        return of(undefined);
      })
    )
  ),
};

class MockApp implements Partial<App> {
  requirePlugin = vi.fn().mockReturnValue(mockOfflineDataPlugin);
}

class MockSyncSchedulerService implements Partial<SyncSchedulerService> {
  hasPending = vi.fn().mockReturnValue(of(false));
}

class MockRouterService implements Partial<RouterService> {
  route = vi.fn().mockReturnValue(of('/'));
  navigate = vi.fn();
}

class MockAuthService implements Partial<AuthService> {
  logout = vi.fn();
}

describe('UserProfileComponent', () => {
  let element: UserProfileComponent;
  let routerService: MockRouterService;
  let syncSchedulerService: MockSyncSchedulerService;
  let authService: MockAuthService;

  const getReceiveDataButton = () => {
    return element.renderRoot.querySelectorAll('button')[1];
  };

  const getDisabledButton = () => {
    return element.renderRoot.querySelector('button[disabled]');
  };

  beforeAll(async () => {
    await useComponent(userProfileComponent);
  });

  beforeEach(async () => {
    const testInjector = createInjector({
      providers: [
        {
          provide: AppRef,
          useClass: MockApp,
        },
        {
          provide: RouterService,
          useClass: MockRouterService,
        },
        {
          provide: SyncSchedulerService,
          useClass: MockSyncSchedulerService,
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
    syncSchedulerService = testInjector.inject(
      SyncSchedulerService
    ) as unknown as MockSyncSchedulerService;
    authService = testInjector.inject(
      AuthService
    ) as unknown as MockAuthService;

    element = await fixture(
      html`<oryx-picking-user-profile></oryx-picking-user-profile>`
    );
  });

  afterEach(() => {
    destroyInjector();
    vi.clearAllMocks();
  });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  it('should be provided', () => {
    expect(element).toBeInstanceOf(UserProfileComponent);
  });

  it('should render its components', () => {
    expect(element.renderRoot.querySelector('.info-block')).not.toBeNull();
    expect(
      element.renderRoot.querySelector('.info-footer oryx-button')
    ).not.toBeNull();
  });

  describe('when sync is pending', () => {
    beforeEach(async () => {
      syncSchedulerService.hasPending.mockReturnValue(of(true));

      element = await fixture(
        '<oryx-picking-user-profile></oryx-picking-user-profile>'
      );
    });

    it('should render oryx notification', () => {
      const notification =
        element.renderRoot.querySelector('oryx-notification')?.textContent;
      expect(notification).toContain('You can');
      expect(notification).toContain(
        't log out because of a pending synchronization'
      );
    });

    it('should disable log out button', () => {
      const button = getDisabledButton();
      expect(button).not.toBeNull();
      expect(button?.textContent).toContain('Log Out');
    });
  });

  describe('when sync is not pending and picking is not in progress', () => {
    it('should not disable log out button', () => {
      expect(getDisabledButton()).toBeNull();
    });

    describe('and when log out button is clicked', () => {
      beforeEach(() => {
        element.renderRoot.querySelector('button')?.click();
      });

      it('should call auth service', () => {
        expect(authService.logout).toHaveBeenCalled();
      });
    });
  });

  describe('when user is on the main page', () => {
    it('should render receive data button', () => {
      expect(getReceiveDataButton()).not.toBeNull();
    });

    describe('and the receive data button is clicked', () => {
      beforeEach(() => {
        getReceiveDataButton().click();
      });
      it('should call offline data plugin', () => {
        expect(mockOfflineDataPlugin.refreshData).toHaveBeenCalled();
      });
      it('should render loading indicator', async () => {
        expect(
          element.renderRoot.querySelector('oryx-button[loading]')
        ).not.toBeNull();
      });

      describe('and receive data completes', () => {
        beforeEach(async () => {
          mockOfflineDataPlugin.refreshData.mockReturnValue(of(undefined));

          element = await fixture(
            `<oryx-picking-user-profile></oryx-picking-user-profile>`
          );
          getReceiveDataButton().click();
        });
        it('should call router service navigate', async () => {
          mockOfflineDataPlugin.refreshData().subscribe();
          expect(routerService.navigate).toHaveBeenCalledWith('/');
        });

        it('should not show loading indicator', () => {
          expect(
            element.renderRoot.querySelector('oryx-button[loading]')
          ).toBeNull();
        });
      });
    });
  });

  describe('when picking is in progress', () => {
    beforeEach(async () => {
      routerService.route.mockReturnValue('/picking/');

      element = await fixture(
        `<oryx-picking-user-profile></oryx-picking-user-profile>`
      );
    });

    it('should render oryx notification', () => {
      const notification =
        element.renderRoot.querySelector('oryx-notification')?.textContent;
      expect(notification).toContain('You can');
      expect(notification).toContain(
        't log out because picking is in progress'
      );
    });

    it('should disable log out button', () => {
      const button = getDisabledButton();
      expect(button).not.toBeNull();
      expect(button?.textContent).toContain('Log Out');
    });
  });
});
