import { fixture, html } from '@open-wc/testing-helpers';
import { notificationComponent } from '@spryker-oryx/ui';
import { useComponent } from '@spryker-oryx/utilities';
import {
  CLOSE_EVENT,
  NotificationComponent,
  NotificationEvent,
} from '@spryker-oryx/ui/notification';
import { NotificationCenterComponent } from './notification-center.component';
import { notificationCenterComponent } from './notification-center.def';

describe('NotificationCenterComponent', () => {
  let element: NotificationCenterComponent;

  beforeAll(async () => {
    vi.useFakeTimers();
    await useComponent([notificationCenterComponent, notificationComponent]);
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  describe('when notification are provided', () => {
    beforeEach(async () => {
      element = await fixture(html`
        <oryx-notification-center></oryx-notification-center>
      `);
      element.open({});
      await element.updateComplete;
    });

    it('should render a notification', () => {
      expect(
        element.renderRoot.querySelectorAll('oryx-notification').length
      ).toBe(1);
    });

    describe('when multiple notifications are provided', () => {
      beforeEach(async () => {
        element = await fixture(html`
          <oryx-notification-center></oryx-notification-center>
        `);
        element.open({});
        element.open({});
        vi.advanceTimersByTime(10);
        await element.updateComplete;
      });

      it('should open two notifications', () => {
        expect(
          element.renderRoot.querySelectorAll('oryx-notification[visible]')
            .length
        ).toBe(2);
      });

      describe('and the close event is dispatched', () => {
        beforeEach(async () => {
          const key =
            element.shadowRoot?.querySelector<NotificationComponent>(
              'oryx-notification'
            )?.key;
          element.dispatchEvent(
            new CustomEvent<NotificationEvent>(CLOSE_EVENT, {
              detail: { key },
              composed: true,
              bubbles: true,
            })
          );
          vi.advanceTimersByTime(1);
        });

        it('should have an invisible notification', () => {
          expect(element).toContainElement('oryx-notification:not([visible])');
        });

        describe('and when the delay is passed', () => {
          beforeEach(async () => {
            vi.advanceTimersByTime(1000);
          });

          it('should have only one notification left', () => {
            expect(
              element.shadowRoot?.querySelectorAll('oryx-notification').length
            ).toBe(1);
          });
        });
      });
    });
  });
});
