import { StorageService } from '@spryker-oryx/core';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { PushService } from '@spryker-oryx/push-notification';
import { of, throwError } from 'rxjs';
import { BapiPushNotificationAdapter } from './adapter/bapi-push-notification.adapter';
import { BapiPushNotificationDefaultService } from './bapi-push-notification-default.service';

class MockPushService implements Partial<PushService> {
  subscribe = vi.fn().mockImplementation(() => of(null));
  unsubscribe = vi.fn().mockImplementation(() => of(null));
}

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
    const callback = vi.fn();

    beforeEach(() => {
      service.initSubscription().subscribe(callback);
    });

    it('should subscribe and send subscription', () => {
      expect(callback).toHaveBeenCalled();
      expect(pushService.subscribe).toHaveBeenCalled();
      expect(adapter.sendSubscription).toHaveBeenCalled();
      expect(storage.get).toHaveBeenCalledWith(subscriptionFlagKey);
      expect(storage.set).toHaveBeenCalledWith(subscriptionFlagKey, true);
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

      service.initSubscription().subscribe({
        error: (err) => expect(err).toEqual(error),
      });
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
});
