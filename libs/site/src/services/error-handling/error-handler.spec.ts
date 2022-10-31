import { ErrorHandler } from '@spryker-oryx/core';
import { createInjector, destroyInjector } from '@spryker-oryx/injector';
import { NotificationService } from '@spryker-oryx/ui/notification-center';
import { SiteErrorHandler } from './error-handler';

const open = vi.fn();

NotificationService.prototype.getCenter = vi.fn().mockReturnValue({ open });

describe('SiteErrorHandler', () => {
  let handler: SiteErrorHandler;
  beforeEach(async () => {
    const testInjector = createInjector({
      providers: [
        {
          provide: ErrorHandler,
          useClass: SiteErrorHandler,
        },
      ],
    });

    handler = testInjector.inject(ErrorHandler) as SiteErrorHandler;
  });

  afterEach(() => {
    vi.clearAllMocks();
    destroyInjector();
  });

  it('should be provided', () => {
    expect(handler).toBeInstanceOf(SiteErrorHandler);
  });
});
