import { ErrorHandler } from '@spryker-oryx/core';
import { createInjector, destroyInjector } from '@spryker-oryx/injector';
import { Types } from '@spryker-oryx/ui/notification';
import { NotificationService } from '../notification';
import { SiteErrorHandler } from './error-handler';

class MockNotificationService implements Partial<NotificationService> {
  push = vi.fn();
}

describe('SiteErrorHandler', () => {
  let handler: SiteErrorHandler;
  let notificationService: MockNotificationService;
  beforeEach(async () => {
    const testInjector = createInjector({
      providers: [
        {
          provide: ErrorHandler,
          useClass: SiteErrorHandler,
        },
        {
          provide: NotificationService,
          useClass: MockNotificationService,
        },
      ],
    });

    handler = testInjector.inject(ErrorHandler) as SiteErrorHandler;
    notificationService = testInjector.inject(
      NotificationService
    ) as unknown as MockNotificationService;
  });

  afterEach(() => {
    vi.clearAllMocks();
    destroyInjector();
  });

  it('should be provided', () => {
    expect(handler).toBeInstanceOf(SiteErrorHandler);
  });

  describe('when an error event is fired', () => {
    it('should call notification service', async () => {
      const event = new ErrorEvent('error', { message: 'ERROR' });
      handler.handle(event);

      expect(notificationService.push).toHaveBeenCalledWith({
        type: Types.ERROR,
        content: 'Error',
        subtext: 'ERROR',
      });
    });
  });
});
