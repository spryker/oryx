import { elementUpdated, fixture, html } from '@open-wc/testing-helpers';
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
      expect(element.registry.length).toBe(1);
      // Has <style>...</style> as a children
      expect(element.renderRoot.children.length).toBe(2);
    });

    it('should close notification by clicking on close button', async () => {
      element.open({});
      await element.updateComplete;
      await elementUpdated(element);

      const notification = element.renderRoot?.children[0];
      notification?.shadowRoot?.querySelector('button')?.click();

      await element.updateComplete;
      await elementUpdated(element);

      expect(element.registry.length).toBe(0);
      // Has <style>...</style> as a children
      expect(element.renderRoot.children.length).toBe(1);
    });
  });
});
