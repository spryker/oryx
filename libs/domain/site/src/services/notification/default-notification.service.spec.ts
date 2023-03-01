import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { Types } from '@spryker-oryx/ui/notification';
import { NotificationPosition } from '@spryker-oryx/ui/notification-center';
import { DefaultNotificationService } from './default-notification.service';
import { NotificationService } from './notification.service';

const mockNotification = {
  type: Types.INFO,
  content: 'mock title',
  subtext: 'content',
  position: NotificationPosition.BottomStart,
};

describe('DefaultNotificationService', () => {
  let service: DefaultNotificationService;

  beforeEach(() => {
    const testInjector = createInjector({
      providers: [
        {
          provide: NotificationService,
          useClass: DefaultNotificationService,
        },
      ],
    });

    service = testInjector.inject(
      NotificationService
    ) as DefaultNotificationService;
  });

  afterEach(() => {
    vi.clearAllMocks();
    destroyInjector();
  });

  it('should be provided', () => {
    expect(service).toBeInstanceOf(DefaultNotificationService);
  });

  describe('when pushing a notification', () => {
    beforeEach(() => {
      service.push(mockNotification);
    });

    it('should retuurn the notification', () => {
      const callback = vi.fn();
      service.get().subscribe(callback);
      expect(callback).toHaveBeenCalledWith(mockNotification);
    });
  });
});
