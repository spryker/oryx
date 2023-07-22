import { fixture, html } from '@open-wc/testing-helpers';
import { useComponent } from '@spryker-oryx/utilities';
import { NotificationComponent } from './notification.component';
import { notificationComponent } from './notification.def';

describe('NotificationComponent', () => {
  let element: NotificationComponent;

  beforeAll(async () => {
    await useComponent(notificationComponent);
  });

  describe('closable', () => {
    const callback = vi.fn();
    beforeEach(async () => {
      element = await fixture(html`
        <oryx-notification closable @oryx.close=${callback}></oryx-notification>
      `);
    });

    it('should render the close button', async () => {
      expect(element).toContainElement('oryx-button');
    });

    describe('when the click event is dispatched', () => {
      beforeEach(() => {
        element.renderRoot.querySelector<HTMLElement>('oryx-button')?.click();
      });

      it('should dispatch the event when click the close button', async () => {
        expect(callback).toHaveBeenCalled();
      });
    });
  });

  describe('translation', () => {
    const closeButtonAriaLabel = 'test';
    beforeEach(async () => {
      element = await fixture(html`
        <oryx-notification
          .closeButtonAriaLabel=${closeButtonAriaLabel}
          closable
        ></oryx-notification>
      `);
    });

    it('should have correct translated aria-labels', async () => {
      const button = element.renderRoot.querySelector('oryx-button');
      expect(button).toHaveProperty('label', closeButtonAriaLabel);
    });
  });
});
