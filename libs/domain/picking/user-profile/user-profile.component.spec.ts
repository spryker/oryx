import { fixture } from '@open-wc/testing-helpers';
import { AuthService } from '@spryker-oryx/auth';
import { App, AppRef, StorageService } from '@spryker-oryx/core';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { SyncSchedulerService } from '@spryker-oryx/offline';
import { RouterService } from '@spryker-oryx/router';
import { i18n, nextTick, useComponent } from '@spryker-oryx/utilities';
import { html } from 'lit';
import { catchError, of, switchMap, throwError } from 'rxjs';
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
  logout = vi.fn().mockReturnValue(of(undefined));
}

class MockStorageService implements Partial<StorageService> {
  get = vi.fn().mockReturnValue(of(undefined));
}

describe('UserProfileComponent', () => {
  let element: UserProfileComponent;
  let routerService: MockRouterService;
  let syncSchedulerService: MockSyncSchedulerService;
  let authService: MockAuthService;
  let storageService: MockStorageService;

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
        {
          provide: StorageService,
          useClass: MockStorageService,
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
    storageService = testInjector.inject(
      StorageService
    ) as unknown as MockStorageService;

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
        '<oryx-picking-user-profile></oryx-picking-user-profile>'
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
      const button = element.renderRoot.querySelectorAll('oryx-button')[0];
      expect(button).toHaveProperty('text', 'Log out');
      expect(button?.hasAttribute('disabled')).toBe(true);
    });
  });

  describe('when sync is not pending and picking is not in progress', () => {
    it('should not disable log out button', () => {
      const button = element.renderRoot.querySelectorAll('oryx-button')[0];
      expect(button).toHaveProperty('text', 'Log out');
      expect(button?.hasAttribute('disabled')).toBe(false);
    });

    describe('and when log out button is clicked', () => {
      beforeEach(() => {
        element.renderRoot.querySelector<HTMLElement>('oryx-button')?.click();
      });

      it('should show loading indicator', () => {
        const button = element.renderRoot.querySelectorAll('oryx-button')[0];
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
    it('should render receive data button', () => {
      expect(element).toContainElement('.receive-data');
    });

    describe('and the receive data button is clicked', () => {
      beforeEach(() => {
        element.renderRoot.querySelector<HTMLElement>('.receive-data')?.click();
      });

      it('should call offline data plugin', () => {
        expect(mockOfflineDataPlugin.refreshData).toHaveBeenCalled();
      });

      it('should render loading indicator', async () => {
        const button = element.renderRoot.querySelector('.receive-data');
        expect(button).toHaveProperty('text', 'Receive data');
        expect(button?.hasAttribute('loading')).toBe(true);
      });

      describe('and receive data completes', () => {
        beforeEach(async () => {
          mockOfflineDataPlugin.refreshData.mockReturnValue(of(undefined));

          element = await fixture(
            `<oryx-picking-user-profile></oryx-picking-user-profile>`
          );
          element.renderRoot
            .querySelector<HTMLElement>('oryx-button.received-data')
            ?.click();
        });

        it('should call router service navigate', async () => {
          mockOfflineDataPlugin.refreshData().subscribe();
          expect(routerService.navigate).toHaveBeenCalledWith('/');
        });

        it('should not show loading indicator', () => {
          const button = element.renderRoot.querySelector('.receive-data');
          expect(button).toHaveProperty('text', 'Receive data');
          expect(button?.hasAttribute('loading')).toBe(false);
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
        `<oryx-picking-user-profile></oryx-picking-user-profile>`
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
