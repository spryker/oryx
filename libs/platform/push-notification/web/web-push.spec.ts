import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { PushProvider } from '@spryker-oryx/push-notification';
import { from, lastValueFrom, map, of } from 'rxjs';
import { WebPushProvider } from './web-push';

class PushManagerMock
  implements Pick<PushManager, 'subscribe' | 'getSubscription'>
{
  subscription = new PushSubscriptionMock();
  subscribe = vi.fn().mockReturnValue(of(this.subscription));
  getSubscription = vi.fn();
}

class PushSubscriptionMock
  implements Pick<PushSubscription, 'unsubscribe' | 'toJSON'>
{
  toJSON = vi.fn();
  unsubscribe = vi.fn();
}

const mockServiceWorker = {
  ready: of({ pushManager: new PushManagerMock() }),
};

const defaultPermissions = {
  notification: 'granted',
  'background-sync': 'granted',
} as Record<string, string>;

const mockPermissions = (permissions = defaultPermissions) => ({
  query: ({ name }: { name: string }) => ({ state: permissions[name] }),
});

describe('WebPushProvider', () => {
  async function getPushManager() {
    return await lastValueFrom(
      from(navigator.serviceWorker.ready).pipe(
        map(
          (serviceWorker) =>
            serviceWorker.pushManager as unknown as PushManagerMock
        )
      )
    );
  }

  let provider: WebPushProvider;

  beforeEach(() => {
    vi.stubGlobal('navigator', {
      serviceWorker: mockServiceWorker,
      permissions: mockPermissions(),
    });
    vi.stubGlobal('window', { SyncManager: {} });

    const testInjector = createInjector({
      providers: [
        {
          provide: PushProvider,
          useClass: WebPushProvider,
        },
      ],
    });

    provider = testInjector.inject(PushProvider) as WebPushProvider;
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.unstubAllGlobals();
    destroyInjector();
  });

  it('should be provided', () => {
    expect(provider).toBeInstanceOf(WebPushProvider);
  });

  describe('init() method', () => {
    it('should immediately resolve', () => {
      const callback = vi.fn();

      provider.init().subscribe(callback);

      expect(callback).toHaveBeenCalled();
    });
  });

  describe('getSubscription() method', () => {
    let pushManager: PushManagerMock;
    beforeEach(async () => {
      pushManager = await getPushManager();
    });

    it('should create and return Promise of subscription data from PushManager', async () => {
      const pushManager = await getPushManager();
      const mockSubscription = { endpoint: 'mock-endpoint' };

      pushManager.subscription.toJSON.mockReturnValue(mockSubscription);
      pushManager.getSubscription.mockReturnValue(of(undefined));
      provider.getSubscription().subscribe((subscription) => {
        expect(pushManager.subscribe).toHaveBeenCalledWith({
          userVisibleOnly: true,
        });
        expect(subscription).toBe(mockSubscription);
      });
    });

    describe('when using app server key', () => {
      beforeEach(async () => {
        destroyInjector();

        const testInjector = createInjector({
          providers: [
            {
              provide: PushProvider,
              useFactory: () =>
                new WebPushProvider({
                  applicationServerKey: 'mock-app&-server key==',
                }),
            },
          ],
        });
        provider = testInjector.inject(PushProvider) as WebPushProvider;
        pushManager = await getPushManager();
      });

      it('should use app server key to create subscription if configured', async () => {
        provider.getSubscription().subscribe(() => {
          expect(
            pushManager.subscribe,
            'applicationServerKey should be URL-safe without base64 padding'
          ).toHaveBeenCalledWith({
            applicationServerKey: 'mock-app%26-server%20key',
            userVisibleOnly: true,
          });
        });
      });
    });

    describe('when userVisibleOnly flag is configured', () => {
      beforeEach(async () => {
        destroyInjector();

        const testInjector = createInjector({
          providers: [
            {
              provide: PushProvider,
              useFactory: () =>
                new WebPushProvider({
                  userVisibleOnly: false,
                }),
            },
          ],
        });
        provider = testInjector.inject(PushProvider) as WebPushProvider;
        pushManager = await getPushManager();
      });
      it('should use custom userVisibleOnly flag', async () => {
        provider.getSubscription().subscribe(() => {
          expect(pushManager.subscribe).toHaveBeenCalledWith({
            userVisibleOnly: false,
          });
        });
      });
    });

    it('should return existing subscription data if subscribed before', async () => {
      const pushSubscription = new PushSubscriptionMock();
      const mockSubscription = { endpoint: 'mock-endpoint' };

      pushSubscription.toJSON.mockReturnValue(mockSubscription);
      pushManager.getSubscription.mockReturnValue(of(pushSubscription));

      provider.getSubscription().subscribe((subscription) => {
        expect(pushManager.subscribe).not.toHaveBeenCalled();
        expect(subscription).toBe(mockSubscription);
      });
    });
  });

  describe('deleteSubscription() method', () => {
    let pushManager: PushManagerMock;
    const pushSubscription = new PushSubscriptionMock();
    describe('when subscription exists', () => {
      beforeEach(async () => {
        pushManager = await getPushManager();
        pushManager.getSubscription.mockReturnValue(of(pushSubscription));
      });
      it('should cancel existing subscription and return Promise of `true` if successful', () => {
        pushSubscription.unsubscribe.mockReturnValue(of(true));

        provider.deleteSubscription().subscribe((result) => {
          expect(result).toBe(true);
        });
      });

      it('should cancel existing subscription and return Promise of `false` if unsuccessful', () => {
        pushSubscription.unsubscribe.mockReturnValue(of(false));

        provider.deleteSubscription().subscribe((result) => {
          expect(result).toBe(false);
        });
      });
    });

    describe('when subscription does not exist', () => {
      it('should return Promise of `true`', () => {
        pushManager.getSubscription.mockReturnValue(of(null));

        provider.deleteSubscription().subscribe((result) => {
          expect(result).toBe(true);
        });
      });
    });
  });

  describe('error handling', () => {
    describe('when service-worker API is not supported', () => {
      beforeEach(() => {
        vi.stubGlobal('navigator', {});
      });

      it('should throw an error', () => {
        provider.getSubscription().subscribe({
          error: (e) => {
            expect(e.message).toBe(
              'Browser does not support service-worker API'
            );
          },
        });
      });
    });

    describe('when syncManager API is not supported', () => {
      beforeEach(() => {
        vi.stubGlobal('window', {});
      });

      it('should throw an error', () => {
        provider.getSubscription().subscribe({
          error: (e) => {
            expect(e.message).toBe(
              'Browser does not support background sync API'
            );
          },
        });
      });
    });

    describe('when notifications are not allowed', () => {
      beforeEach(() => {
        vi.stubGlobal('navigator', {
          serviceWorker: mockServiceWorker,
          permissions: mockPermissions({ notification: 'denied' }),
        });
      });

      it('should throw an error', () => {
        provider.getSubscription().subscribe({
          error: (e) => {
            expect(e.message).toBe(
              'Permission to accept push notifications is not granted. Check the browser configuration or reset the permission'
            );
          },
        });
      });
    });

    describe('when background sync is not allowed', () => {
      beforeEach(() => {
        vi.stubGlobal('navigator', {
          serviceWorker: mockServiceWorker,
          permissions: mockPermissions({ 'background-sync': 'denied' }),
        });
      });

      it('should throw an error', () => {
        provider.getSubscription().subscribe({
          error: (e) => {
            expect(e.message).toBe(
              'Permission to perform background sync is not granted. Check the browser configuration or reset the permission'
            );
          },
        });
      });
    });
  });
});
