import { HttpService } from '@spryker-oryx/core';
import { HttpTestService } from '@spryker-oryx/core/testing';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { of } from 'rxjs';
import { DefaultPushService } from './default-push.service';
import { PushProvider } from './providers';
import { PushService, PushServiceConfig } from './push.service';

class ProviderMock implements PushProvider {
  init = vi.fn();
  getSubscription = vi.fn();
  deleteSubscription = vi.fn();
}

const apiUrl = 'mockurl';

describe('PushService', () => {
  let service: PushService;
  let provider: ProviderMock;
  let http: HttpTestService;

  beforeEach(() => {
    const testInjector = createInjector({
      providers: [
        {
          provide: PushService,
          useClass: DefaultPushService,
        },
        {
          provide: HttpService,
          useClass: HttpTestService,
        },
        {
          provide: PushServiceConfig,
          useValue: { apiUrl },
        },
        {
          provide: PushProvider,
          useClass: ProviderMock,
        },
      ],
    });

    service = testInjector.inject(PushService);
    provider = testInjector.inject(PushProvider) as ProviderMock;
    http = testInjector.inject(HttpService) as HttpTestService;
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
      expect(http.url).toBe(`${apiUrl}/push-token`);
    });

    it('should send subscription with merchant ref to api client', async () => {
      const token = '1234';
      const callback = vi.fn();
      provider.getSubscription.mockReturnValue(of(token));
      http.flush(token);

      service.subscribe().subscribe(callback);

      expect(callback).toHaveBeenCalledWith(token);
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
