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

describe('WebPushProvider', () => {
  const callback = vi.fn();

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
    vi.stubGlobal('navigator', { serviceWorker: mockServiceWorker });

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
      const mockSubscription = { endpoint: 'mock-endpoint' };

      pushManager.subscription.toJSON.mockReturnValue(mockSubscription);
      pushManager.getSubscription.mockReturnValue(of(undefined));
      provider.getSubscription().subscribe(callback);

      expect(pushManager.subscribe).toHaveBeenCalledWith({
        userVisibleOnly: true,
      });
      expect(callback).toHaveBeenCalledWith(mockSubscription);
      // Should be a different object then original subscription
      expect(callback).not.toHaveBeenCalledWith(pushManager.subscription);
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
        provider.getSubscription().subscribe(callback);
        expect(
          pushManager.subscribe,
          'applicationServerKey should be URL-safe without base64 padding'
        ).toHaveBeenCalledWith({
          applicationServerKey: 'mock-app%26-server%20key',
          userVisibleOnly: true,
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
        provider.getSubscription().subscribe(callback);
        expect(pushManager.subscribe).toHaveBeenCalledWith({
          userVisibleOnly: false,
        });
      });
    });

    it('should return existing subscription data if subscribed before', async () => {
      const pushSubscription = new PushSubscriptionMock();
      const mockSubscription = { endpoint: 'mock-endpoint' };

      pushSubscription.toJSON.mockReturnValue(mockSubscription);
      pushManager.getSubscription.mockReturnValue(of(pushSubscription));

      provider.getSubscription().subscribe(callback);
      expect(pushManager.subscribe).not.toHaveBeenCalled();
      expect(callback).toHaveBeenCalledWith(mockSubscription);
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

        provider.deleteSubscription().subscribe(callback);
        expect(callback).toHaveBeenCalledWith(true);
      });

      it('should cancel existing subscription and return Promise of `false` if unsuccessful', () => {
        pushSubscription.unsubscribe.mockReturnValue(of(false));

        provider.deleteSubscription().subscribe(callback);
        expect(callback).toHaveBeenCalledWith(false);
      });
    });

    describe('when subscription does not exist', () => {
      it('should return Promise of `true`', () => {
        pushManager.getSubscription.mockReturnValue(of(null));

        provider.deleteSubscription().subscribe(callback);
        expect(callback).toHaveBeenCalledWith(true);
      });
    });
  });
});
