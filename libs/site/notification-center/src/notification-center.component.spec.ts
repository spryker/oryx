import { fixture } from '@open-wc/testing-helpers';
import { useComponent } from '@spryker-oryx/core/utilities';
import { ExperienceService } from '@spryker-oryx/experience';
import { createInjector, destroyInjector } from '@spryker-oryx/injector';
import { NotificationService } from '@spryker-oryx/site';
import { Types } from '@spryker-oryx/ui/notification';
import {
  notificationCenterComponent,
  NotificationCenterComponent,
  Positions,
} from '@spryker-oryx/ui/notification-center';
import { html } from 'lit';
import { of, Subject } from 'rxjs';
import { SiteNotificationCenterComponent } from './notification-center.component';
import { siteNotificationCenterComponent } from './notification-center.def';

const mockNotification = {
  type: Types.ERROR,
  content: 'Error',
  subtext: 'Mock error',
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
  let notificationService: MockNotificationService;

  beforeAll(async () => {
    await useComponent([
      siteNotificationCenterComponent,
      notificationCenterComponent,
    ]);
  });

  beforeEach(async () => {
    const testInjector = createInjector({
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
      html`<site-notification-center></site-notification-center>`
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
        html`<site-notification-center
          .options=${{ position: Positions.TOP_START }}
        ></site-notification-center>`
      );
    });
    it('should display notification in the correct position', async () => {
      const notificationCenter = element.shadowRoot?.querySelector(
        'oryx-notification-center'
      ) as NotificationCenterComponent;
      expect(notificationCenter.position).toBe('top-start');
    });
  });

  describe('when type is set', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<site-notification-center
          .options=${{ type: Types.INFO }}
        ></site-notification-center>`
      );
    });
    it('should display notification with the given type', () => {
      const notificationCenter = element.shadowRoot?.querySelector(
        'oryx-notification-center'
      ) as NotificationCenterComponent;

      const open = vi.spyOn(notificationCenter, 'open');
      notificationTrigger$.next(mockNotification);
      expect(open).toHaveBeenCalledWith(mockNotification);
    });
  });
});
