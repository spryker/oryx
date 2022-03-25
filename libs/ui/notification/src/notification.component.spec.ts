import { expect, fixture, html } from '@open-wc/testing';
import { stub } from 'sinon';
import './index';
import { NotificationComponent } from './notification.component';

describe('NotificationComponent', () => {
  let element: NotificationComponent;

  const getButton = (selector: string): HTMLElement | null | undefined =>
    element.shadowRoot?.querySelector(selector);

  describe('closable', () => {
    let button: HTMLElement | null | undefined;
    const callback = stub();

    beforeEach(async () => {
      element = await fixture(html`
        <oryx-notification closable @oryx.close=${callback}></oryx-notification>
      `);
      button = getButton('button');
    });

    it('should render the close button', async () => {
      expect(button).to.be.exist;
    });

    it('should dispatch the event when click the close button', async () => {
      button?.click();
      expect(callback).to.be.calledOnce;
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

      expect(closeBtn?.getAttribute('aria-label')).to.eq(closeButtonAriaLabel);
    });
  });
});
