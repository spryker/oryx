import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { of } from 'rxjs';
import { DefaultPushService } from './default-push.service';
import { PushProvider } from './providers';
import { PushService } from './push.service';

class ProviderMock implements PushProvider {
  init = vi.fn();
  getSubscription = vi.fn();
  deleteSubscription = vi.fn();
}

describe('PushService', () => {
  let service: PushService;
  let provider: ProviderMock;

  beforeEach(() => {
    const testInjector = createInjector({
      providers: [
        {
          provide: PushService,
          useClass: DefaultPushService,
        },
        {
          provide: PushProvider,
          useClass: ProviderMock,
        },
      ],
    });

    service = testInjector.inject(PushService);
    provider = testInjector.inject(PushProvider) as ProviderMock;
  });

  afterEach(() => {
    vi.clearAllMocks();
    destroyInjector();
  });

  it('should be provided', () => {
    expect(service).toBeInstanceOf(DefaultPushService);
  });

  describe('subscribe() method', () => {
    it('should create subscription', async () => {
      provider.getSubscription.mockReturnValue(of(null));

      service.subscribe().subscribe();
      expect(provider.getSubscription).toHaveBeenCalled();
    });

    it('should return subscription', async () => {
      const subscription = '1234';
      const callback = vi.fn();
      provider.getSubscription.mockReturnValue(of(subscription));

      service.subscribe().subscribe(callback);

      expect(callback).toHaveBeenCalledWith(subscription);
    });
  });

  describe('unSubscribe() method', () => {
    it('should delete subscription and return result', async () => {
      const callback = vi.fn();
      provider.deleteSubscription.mockReturnValue(of(true));

      service.unsubscribe().subscribe(callback);

      expect(provider.deleteSubscription).toHaveBeenCalled();
      expect(callback).toBeTruthy();
    });
  });
});
