import { StorageService } from '@spryker-oryx/core';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { PushService } from '@spryker-oryx/push-notification';
import { Subscription, of, throwError } from 'rxjs';
import { BapiPushNotificationAdapter } from './adapter';
import { BapiPushNotificationDefaultService } from './bapi-push-notification-default.service';

class MockPushService implements Partial<PushService> {
  subscribe = vi.fn().mockImplementation(() => of(null));
  unsubscribe = vi.fn().mockImplementation(() => of(null));
}

const defaultPermissions = {
  notification: 'granted',
  'background-sync': 'granted',
} as Record<string, string>;

const mockPermissions = (permissions = defaultPermissions) => ({
  query: ({ name }: { name: string }) => ({ state: permissions[name] }),
});

class MockBapiPushNotificationAdapter
  implements Partial<BapiPushNotificationAdapter>
{
  sendSubscription = vi.fn().mockImplementation(() => of(null));
}

class MockStorageService implements Partial<StorageService> {
  get = vi.fn().mockImplementation(() => of(false));
  set = vi.fn().mockImplementation(() => of(null));
  remove = vi.fn().mockImplementation(() => of(null));
}

describe('BapiPushNotificationDefaultService', () => {
  const subscriptionFlagKey = 'oryx.push-notification-subscription';

  let service: BapiPushNotificationDefaultService;
  let pushService: MockPushService;
  let adapter: MockBapiPushNotificationAdapter;
  let storage: MockStorageService;

  beforeEach(() => {
    vi.stubGlobal('navigator', {
      serviceWorker: {},
      permissions: mockPermissions(),
    });
    vi.stubGlobal('window', { SyncManager: {} });

    const testInjector = createInjector({
      providers: [
        {
          provide: BapiPushNotificationDefaultService,
          useClass: BapiPushNotificationDefaultService,
        },
        {
          provide: PushService,
          useClass: MockPushService,
        },
        {
          provide: BapiPushNotificationAdapter,
          useClass: MockBapiPushNotificationAdapter,
        },
        {
          provide: StorageService,
          useClass: MockStorageService,
        },
      ],
    });

    service = testInjector.inject(BapiPushNotificationDefaultService);
    pushService = testInjector.inject(
      PushService
    ) as unknown as MockPushService;
    adapter = testInjector.inject(
      BapiPushNotificationAdapter
    ) as unknown as MockBapiPushNotificationAdapter;
    storage = testInjector.inject(
      StorageService
    ) as unknown as MockStorageService;
  });

  afterEach(() => {
    vi.clearAllMocks();
    destroyInjector();
  });

  it('should be provided', () => {
    expect(service).toBeInstanceOf(BapiPushNotificationDefaultService);
  });

  describe('when initSubscription is called', () => {
    let subscription: Subscription;

    afterEach(() => {
      if (subscription) {
        subscription.unsubscribe();
      }
    });

    it('should subscribe and send subscription', () => {
      service.initSubscription().subscribe(() => {
        expect(pushService.subscribe).toHaveBeenCalled();
        expect(adapter.sendSubscription).toHaveBeenCalled();
        expect(storage.get).toHaveBeenCalledWith(subscriptionFlagKey);
        expect(storage.set).toHaveBeenCalledWith(subscriptionFlagKey, true);
      });
    });

    it('should handle error when subscription already exists', () => {
      const error = {
        body: {
          errors: [
            {
              status: 400,
              code: 5003,
            },
          ],
        },
      };
      adapter.sendSubscription.mockImplementationOnce(() =>
        throwError(() => error)
      );

      const errorSubscription = service.initSubscription().subscribe({
        error: (err) => expect(err).toEqual(error),
      });

      errorSubscription.unsubscribe();
    });
  });

  describe('when unsubscribe is called', () => {
    const callback = vi.fn();

    beforeEach(() => {
      service.unsubscribe().subscribe(callback);
    });

    it('should unsubscribe and remove subscription flag', () => {
      expect(callback).toHaveBeenCalled();
      expect(pushService.unsubscribe).toHaveBeenCalled();
      expect(storage.remove).toHaveBeenCalledWith(subscriptionFlagKey);
    });
  });

  describe('error handling', () => {
    describe('when service-worker API is not supported', () => {
      beforeEach(() => {
        vi.stubGlobal('navigator', {});
      });

      it('should throw an error', () => {
        service
          .initSubscription()
          .subscribe({
            error: (e) =>
              expect(e.message).toBe(
                'Browser does not support service-worker API'
              ),
          })
          .unsubscribe();
      });
    });

    describe('when syncManager API is not supported', () => {
      beforeEach(() => {
        vi.stubGlobal('window', {});
      });

      it('should throw an error', () => {
        service
          .initSubscription()
          .subscribe({
            error: (e) =>
              expect(e.message).toBe(
                'Browser does not support background sync API'
              ),
          })
          .unsubscribe();
      });
    });

    describe('when notifications are not allowed', () => {
      beforeEach(() => {
        vi.stubGlobal('navigator', {
          serviceWorker: {},
          permissions: mockPermissions({ notification: 'denied' }),
        });
      });

      it('should throw an error', () => {
        service
          .initSubscription()
          .subscribe({
            error: (e) =>
              expect(e.message).toBe(
                'Permission to accept push notifications is not granted. Check the browser configuration or reset the permission'
              ),
          })
          .unsubscribe();
      });
    });

    describe('when background sync is not allowed', () => {
      beforeEach(() => {
        vi.stubGlobal('navigator', {
          serviceWorker: {},
          permissions: mockPermissions({ 'background-sync': 'denied' }),
        });
      });

      it('should throw an error', () => {
        service
          .initSubscription()
          .subscribe({
            error: (e) =>
              expect(e.message).toBe(
                'Permission to perform background sync is not granted. Check the browser configuration or reset the permission'
              ),
          })
          .unsubscribe();
      });
    });
  });
});
