import { ErrorHandler } from '@spryker-oryx/core';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
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

  describe('when an error object is handled', () => {
    it('should call notification service with error message', async () => {
      const error = { message: 'ERROR' };

      handler.handle(error);

      expect(notificationService.push).toHaveBeenCalledWith({
        type: Types.ERROR,
        content: 'Error',
        subtext: 'ERROR',
      });
    });
  });

  describe('when an error value is handled', () => {
    it('should call notification service with stringified object', async () => {
      const error = { notAnError: true };

      handler.handle(error);

      expect(notificationService.push).toHaveBeenCalledWith({
        type: Types.ERROR,
        content: 'Error',
        subtext: '[object Object]',
      });
    });
  });

  describe('when an API error body value is handled', () => {
    it('should call notification service with string of first error item', async () => {
      const error = {
        body: {
          errors: [{ code: 'code', detail: 'detail', status: 'status' }],
        },
      };

      handler.handle(error);

      expect(notificationService.push).toHaveBeenCalledWith({
        type: Types.ERROR,
        content: 'Error',
        subtext: `${error.body.errors[0].status} ${error.body.errors[0].detail}`,
      });
    });
  });
});
