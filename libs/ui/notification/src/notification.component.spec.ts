import { expect, fixture, html } from '@open-wc/testing';
import { stub } from 'sinon';
import './index';
import { NotificationComponent, TAG_NAME } from './notification.component';
import { Schemes, Types } from './notification.model';

describe('NotificationComponent', () => {
  let element: NotificationComponent;

  it('is defined', () => {
    const el = document.createElement(TAG_NAME);
    expect(el).to.be.instanceof(NotificationComponent);
  });

  describe('mount', () => {
    beforeEach(async () => {
      element = await fixture(html`<oryx-notification></oryx-notification>`);
    });
    it('should have default type attribute', () => {
      expect(element.getAttribute('type')).to.be.eq(Types.INFO);
    });
    it('should have default scheme attribute ', () => {
      expect(element.getAttribute('scheme')).to.be.eq(Schemes.LIGHT);
    });
  });

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
