import { fixture } from '@open-wc/testing-helpers';
import { AuthService, IdentityService } from '@spryker-oryx/auth';
import { App, AppRef, StorageService } from '@spryker-oryx/core';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { NetworkStateService } from '@spryker-oryx/offline';
import { SyncSchedulerService } from '@spryker-oryx/offline/sync';
import { RouterService } from '@spryker-oryx/router';
import { i18n, nextTick, useComponent } from '@spryker-oryx/utilities';
import { html } from 'lit';
import { catchError, of, switchMap, throwError } from 'rxjs';
import { PickingUserProfileComponent } from './user-profile.component';
import { pickingUserProfileComponent } from './user-profile.def';

const mockOfflineDataPlugin = {
  syncData: vi.fn().mockReturnValue(
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
  route = vi.fn().mockReturnValue(of(''));
  navigate = vi.fn();
}

class MockAuthService implements Partial<AuthService> {
  logout = vi.fn().mockReturnValue(of(undefined));
}

class MockStorageService implements Partial<StorageService> {
  get = vi.fn().mockReturnValue(of(undefined));
}

class MockNetworkStateService implements Partial<NetworkStateService> {
  online = vi.fn().mockReturnValue(of(true));
}

class MockIdentityService implements IdentityService {
  get = vi.fn().mockReturnValue(of({}));
}

describe('PickingUserProfileComponent', () => {
  let element: PickingUserProfileComponent;
  let routerService: MockRouterService;
  let syncSchedulerService: MockSyncSchedulerService;
  let authService: MockAuthService;
  let storageService: MockStorageService;
  let networkService: MockNetworkStateService;

  beforeAll(async () => {
    await useComponent(pickingUserProfileComponent);
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
        {
          provide: StorageService,
          useClass: MockStorageService,
        },
        {
          provide: NetworkStateService,
          useClass: MockNetworkStateService,
        },
        {
          provide: IdentityService,
          useClass: MockIdentityService,
        },
      ],
    });

    routerService = testInjector.inject<MockRouterService>(RouterService);
    syncSchedulerService =
      testInjector.inject<MockSyncSchedulerService>(SyncSchedulerService);
    authService = testInjector.inject<MockAuthService>(AuthService);
    storageService = testInjector.inject<MockStorageService>(StorageService);
    networkService =
      testInjector.inject<MockNetworkStateService>(NetworkStateService);

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
    expect(element).toBeInstanceOf(PickingUserProfileComponent);
  });

  it('should render its components', () => {
    expect(element.renderRoot.querySelector('.info-block')).not.toBeNull();
    expect(
      element.renderRoot.querySelector('.info-footer oryx-button')
    ).not.toBeNull();
  });

  it('should not render warehouse location', () => {
    element.renderRoot.querySelectorAll('dl').forEach((item) => {
      expect(item.querySelector('dt')?.textContent).not.toContain(
        i18n('user.profile.location')
      );
    });
  });

  describe('when sync is pending', () => {
    beforeEach(async () => {
      syncSchedulerService.hasPending.mockReturnValue(of(true));

      element = await fixture(
        html`<oryx-picking-user-profile></oryx-picking-user-profile>`
      );
    });

    it('should render oryx notification', () => {
      const notification =
        element.renderRoot.querySelector('oryx-notification')?.textContent;
      expect(notification).toContain(
        "You can't log out because of a pending synchronization"
      );
    });

    it('should disable log out button', () => {
      const button = element.renderRoot.querySelector(
        'oryx-button.logout-button'
      );
      expect(button).toHaveProperty('text', 'Log out');
      expect(button?.hasAttribute('disabled')).toBe(true);
    });
  });

  describe('when sync is not pending and picking is not in progress', () => {
    it('should not disable log out button', () => {
      const button = element.renderRoot.querySelector(
        'oryx-button.logout-button'
      );
      expect(button).toHaveProperty('text', 'Log out');
      expect(button?.hasAttribute('disabled')).toBe(false);
    });

    describe('and when log out button is clicked', () => {
      beforeEach(() => {
        element.renderRoot.querySelector<HTMLElement>('oryx-button')?.click();
      });

      it('should show loading indicator', () => {
        const button = element.renderRoot.querySelector(
          'oryx-button.logout-button'
        );
        expect(button).toHaveProperty('text', 'Log out');
        expect(button?.hasAttribute('loading')).toBe(true);
      });

      it('should call auth service', () => {
        expect(authService.logout).toHaveBeenCalled();
      });

      describe('and when log out fails', () => {
        beforeEach(() => {
          authService.logout.mockReturnValue(
            throwError(() => new Error('error'))
          );
          element.renderRoot
            .querySelector<HTMLElement>('.logout-button')
            ?.click();
        });

        it('should not show loading indicator', () => {
          const button = element.renderRoot.querySelector('.logout-button');
          expect(button).toHaveProperty('text', 'Log out');
          expect(button?.hasAttribute('loading')).toBe(false);
        });

        it('auth service should throw error', () => {
          const callback = vi.fn().mockReturnValue(of(''));
          authService.logout().pipe(catchError(callback)).subscribe();

          expect(callback).toHaveBeenCalled();
        });
      });
    });
  });

  describe('when user is on the main page', () => {
    beforeEach(async () => {
      routerService.route = vi.fn().mockReturnValue(of('/'));

      element = await fixture(
        html`<oryx-picking-user-profile></oryx-picking-user-profile>`
      );
    });

    it('should render not disabled sync data button', () => {
      expect(element).toContainElement('.sync-data:not([disabled])');
    });

    describe('and the receive data button is clicked', () => {
      beforeEach(() => {
        element.renderRoot.querySelector<HTMLElement>('.sync-data')?.click();
      });

      it('should call offline data plugin', () => {
        expect(mockOfflineDataPlugin.syncData).toHaveBeenCalled();
      });

      it('should render loading indicator', async () => {
        const button = element.renderRoot.querySelector('.sync-data');
        expect(button).toHaveProperty('text', 'Sync data');
        expect(button?.hasAttribute('loading')).toBe(true);
      });

      describe('and receive data completes', () => {
        beforeEach(async () => {
          mockOfflineDataPlugin.syncData.mockReturnValue(of(undefined));

          element = await fixture(
            html`<oryx-picking-user-profile></oryx-picking-user-profile>`
          );
          element.renderRoot
            .querySelector<HTMLElement>('oryx-button.received-data')
            ?.click();
        });

        it('should not show loading indicator', () => {
          const button = element.renderRoot.querySelector('.sync-data');
          expect(button).toHaveProperty('text', 'Sync data');
          expect(button?.hasAttribute('loading')).toBe(false);
        });
      });
    });

    describe('and network is in offline state', () => {
      beforeEach(async () => {
        networkService.online = vi.fn().mockReturnValue(of(false));

        element = await fixture(
          html`<oryx-picking-user-profile></oryx-picking-user-profile>`
        );
      });

      it('should disable sync data button', () => {
        expect(element).toContainElement('.sync-data[disabled]');
      });
    });
  });

  describe('when picking is in progress', () => {
    beforeEach(async () => {
      routerService.route.mockReturnValue('/picking/');

      element = await fixture(
        html`<oryx-picking-user-profile></oryx-picking-user-profile>`
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
      const button = element.renderRoot.querySelectorAll('oryx-button')[0];
      expect(button).toHaveProperty('text', 'Log out');
      expect(button?.hasAttribute('disabled')).toBe(true);
    });
  });

  describe('when there is warehouseUserAssignment in the storage', () => {
    const mockWarehouseName = 'mockWarehouseName';

    beforeEach(async () => {
      storageService.get = vi
        .fn()
        .mockReturnValue(of({ warehouse: { name: mockWarehouseName } }));

      element = await fixture(
        html`<oryx-picking-user-profile></oryx-picking-user-profile>`
      );
    });

    it('should render warehouse location', () => {
      expect(
        element.renderRoot.querySelectorAll('dl')[0].textContent
      ).toContain(i18n('user.profile.location'));
      expect(
        element.renderRoot.querySelectorAll('dd')[0].textContent
      ).toContain(mockWarehouseName);
    });
  });
});
