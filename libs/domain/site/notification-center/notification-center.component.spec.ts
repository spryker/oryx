import { fixture } from '@open-wc/testing-helpers';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { ExperienceService } from '@spryker-oryx/experience';
import { NotificationService } from '@spryker-oryx/site';
import { AlertType, notificationCenterComponent } from '@spryker-oryx/ui';
import {
  NotificationCenterComponent,
  NotificationPosition,
} from '@spryker-oryx/ui/notification-center';
import { useComponent } from '@spryker-oryx/utilities';
import { html } from 'lit';
import { Subject, of } from 'rxjs';
import { SiteNotificationCenterComponent } from './notification-center.component';
import { siteNotificationCenterComponent } from './notification-center.def';

const mockNotification = {
  type: AlertType.Error,
  content: 'Error',
  subtext: 'Mock error',
  autoCloseTime: 8000,
};

const mockNotificationWithoutAutoClose = {
  type: AlertType.Error,
  content: 'Error',
  subtext: 'Mock error',
  autoClose: true,
};

const notificationTrigger$ = new Subject();

class MockExperienceContentService implements Partial<ExperienceService> {
  getOptions = vi.fn().mockReturnValue(of({}));
}

class MockNotificationService implements Partial<NotificationService> {
  get = vi.fn().mockReturnValue(notificationTrigger$);
}

describe('SiteNotificationCenterComponent', () => {
  let element: SiteNotificationCenterComponent;

  beforeAll(async () => {
    await useComponent([
      siteNotificationCenterComponent,
      notificationCenterComponent,
    ]);
  });

  beforeEach(async () => {
    createInjector({
      providers: [
        {
          provide: ExperienceService,
          useClass: MockExperienceContentService,
        },
        {
          provide: NotificationService,
          useClass: MockNotificationService,
        },
      ],
    });

    element = await fixture(
      html`<oryx-site-notification-center></oryx-site-notification-center>`
    );
  });

  afterEach(() => {
    destroyInjector();
    vi.clearAllMocks();
  });

  it('is defined', () => {
    expect(element).toBeInstanceOf(SiteNotificationCenterComponent);
  });

  describe('when error is emitted', () => {
    it('should display a notification', () => {
      const notificationCenter = element.shadowRoot?.querySelector(
        'oryx-notification-center'
      ) as NotificationCenterComponent;
      const open = vi.spyOn(notificationCenter, 'open');
      notificationTrigger$.next(mockNotification);

      expect(open).toHaveBeenCalledWith(mockNotification);
    });
  });

  describe('when position is set', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-site-notification-center
          .options=${{ position: NotificationPosition.TopStart }}
        ></oryx-site-notification-center>`
      );
    });

    it('should display notification in the correct position', async () => {
      const notificationCenter = element.shadowRoot?.querySelector(
        'oryx-notification-center'
      ) as NotificationCenterComponent;
      expect(notificationCenter.position).toBe('top-start');
    });
  });
});
