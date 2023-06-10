import { getShadowElementBySelector } from '@/tools/testing';
import { fixture, html } from '@open-wc/testing-helpers';
import { useComponent } from '@spryker-oryx/core/utilities';
import { NotificationComponent } from './notification.component';
import { notificationComponent } from './notification.def';

describe('NotificationComponent', () => {
  let element: NotificationComponent;

  const getButton = (selector: string): HTMLElement | null | undefined =>
    getShadowElementBySelector(element, selector);

  beforeAll(async () => {
    await useComponent(notificationComponent);
  });

  describe('closable', () => {
    let button: HTMLElement | null | undefined;
    const callback = vi.fn();
    beforeEach(async () => {
      element = await fixture(html`
        <oryx-notification closable @oryx.close=${callback}></oryx-notification>
      `);
      button = getButton('button');
    });

    it('should render the close button', async () => {
      expect(button).not.toBeNull();
    });

    it('should dispatch the event when click the close button', async () => {
      button?.click();
      expect(callback).toHaveBeenCalled();
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
      const closeBtn = getButton('button');

      expect(closeBtn?.getAttribute('aria-label')).toBe(closeButtonAriaLabel);
    });
  });
});
