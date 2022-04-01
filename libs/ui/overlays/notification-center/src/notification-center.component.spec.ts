import { elementUpdated, expect, fixture, html } from '@open-wc/testing';
import './index';
import { NotificationCenterComponent } from './notification-center.component';

describe('NotificationCenterComponent', () => {
  let element: NotificationCenterComponent;

  describe('handle notification', () => {
    beforeEach(async () => {
      element = await fixture(html`
        <oryx-notification-center></oryx-notification-center>
      `);
    });

    it('should open new notification', async () => {
      element.open({});
      await element.updateComplete;
      await elementUpdated(element);
      expect(element.registry.length).to.be.equal(1);
      expect(element.renderRoot.children.length).to.be.equal(1);
    });

    it('should close notification by clicking on close button', async () => {
      element.open({});
      await element.updateComplete;
      await elementUpdated(element);

      const notification = element.renderRoot?.children[0];
      notification?.shadowRoot?.querySelector('button')?.click();

      await element.updateComplete;
      await elementUpdated(element);

      expect(element.registry.length).to.be.equal(0);
      expect(element.renderRoot.children.length).to.be.equal(0);
    });
  });
});
