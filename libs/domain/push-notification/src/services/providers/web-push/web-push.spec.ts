import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { of } from 'rxjs';
import { PushProvider } from '../';
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
  ready: new Promise<any>((resolve) =>
    resolve({ pushManager: new PushManagerMock() })
  ),
};

Object.defineProperty(navigator, 'serviceWorker', {
  value: mockServiceWorker,
  configurable: true,
});

describe('WebPushProvider', () => {
  async function getPushManager() {
    const serviceWorker = await navigator.serviceWorker.ready;
    return serviceWorker.pushManager as unknown as PushManagerMock;
  }

  let provider: WebPushProvider;

  beforeEach(() => {
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
      const mockSubscription = { endpoint: 'mock-endpoint' };

      pushManager.subscription.toJSON.mockReturnValue(mockSubscription);
      pushManager.getSubscription.mockReturnValue(of(undefined));

      provider.getSubscription().subscribe((subscription) => {
        expect(pushManager.subscribe).toHaveBeenCalledWith({
          userVisibleOnly: true,
        });
        expect(subscription).toEqual(mockSubscription);
        // Should be a different object then original subscription
        expect(subscription).not.toEqual(pushManager.subscription);
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
        expect(subscription).toEqual(mockSubscription);
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
          expect(result).toBeTruthy();
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
          expect(result).toBeTruthy();
        });
      });
    });
  });
});
