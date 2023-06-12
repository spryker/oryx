import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { PickingHttpService } from '../../../src/services';

import { of } from 'rxjs';
import { beforeEach } from 'vitest';
import { BapiPushNotificationDefaultAdapter } from './bapi-push-notification-default.adapter';
import { BapiPushNotificationAdapter } from './bapi-push-notification.adapter';

class MockPickingHttpService implements Partial<PickingHttpService> {
  post = vi.fn().mockImplementation(() => of(null));
}

describe('BapiPushNotificationDefaultAdapter', () => {
  let adapter: BapiPushNotificationAdapter;
  let http: PickingHttpService;

  beforeEach(() => {
    const testInjector = createInjector({
      providers: [
        {
          provide: BapiPushNotificationAdapter,
          useClass: BapiPushNotificationDefaultAdapter,
        },
        {
          provide: PickingHttpService,
          useClass: MockPickingHttpService,
        },
      ],
    });

    adapter = testInjector.inject(BapiPushNotificationAdapter);
    http = testInjector.inject(PickingHttpService);
  });

  afterEach(() => {
    vi.clearAllMocks();
    destroyInjector();
  });

  it('should be provided', () => {
    expect(adapter).toBeInstanceOf(BapiPushNotificationDefaultAdapter);
  });

  describe('when "sendSubscription" is called', () => {
    const callback = vi.fn();
    const mockSubscription = 'mockSubscription';

    beforeEach(() => {
      adapter.sendSubscription(mockSubscription).subscribe(callback);
    });

    it('should call the post method of PickingHttpService with correct arguments', () => {
      expect(http.post).toHaveBeenCalledWith(
        '/push-notification-subscriptions',
        {
          data: {
            type: 'push-notification-subscriptions',
            attributes: {
              providerName: 'web-push-php',
              group: {
                name: 'warehouse',
                identifier: 'e84b3cb8-a94a-5a7e-9adb-cc5353f7a73f',
              },
              payload: mockSubscription,
            },
          },
        }
      );
    });
  });
});
