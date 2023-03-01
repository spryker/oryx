import { fixture } from '@open-wc/testing-helpers';
import { useComponent } from '@spryker-oryx/core/utilities';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { ExperienceService } from '@spryker-oryx/experience';
import { NotificationService } from '@spryker-oryx/site';
import { Types } from '@spryker-oryx/ui/notification';
import {
  notificationCenterComponent,
  NotificationCenterComponent,
  NotificationPosition,
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

  describe('when maxWidth option is provided', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-site-notification-center
          .options=${{ maxWidth: '50%' }}
        ></oryx-site-notification-center>`
      );
    });

    it('should create a CSS variable at the oryx-notification-center', () => {
      const notificationCenter = element.shadowRoot?.querySelector(
        'oryx-notification-center'
      ) as NotificationCenterComponent;
      expect(
        notificationCenter.style.getPropertyValue(
          '--oryx-notification-max-width'
        )
      ).toBe('50%');
    });
  });

  describe('when marginBlock option is provided', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-site-notification-center
          .options=${{ marginBlock: '10vh' }}
        ></oryx-site-notification-center>`
      );
    });

    it('should create a CSS variable at the oryx-notification-center', () => {
      const notificationCenter = element.shadowRoot?.querySelector(
        'oryx-notification-center'
      ) as NotificationCenterComponent;
      expect(
        notificationCenter.style.getPropertyValue(
          '--oryx-notification-margin-block'
        )
      ).toBe('10vh');
    });
  });

  describe('when marginInline option is provided', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-site-notification-center
          .options=${{ marginInline: '10vw' }}
        ></oryx-site-notification-center>`
      );
    });

    it('should create a CSS variable at the oryx-notification-center', () => {
      const notificationCenter = element.shadowRoot?.querySelector(
        'oryx-notification-center'
      ) as NotificationCenterComponent;
      expect(
        notificationCenter.style.getPropertyValue(
          '--oryx-notification-margin-inline'
        )
      ).toBe('10vw');
    });
  });
});
