import { fixture, html } from '@open-wc/testing-helpers';
import { Positions } from '../notification-center.model';
import { TAG_NAME } from '../utilities';
import { NotificationService } from './notification.service';

describe('NotificationService', () => {
  const service = new NotificationService();
  describe('getCenter', () => {
    beforeEach(async () => {
      await fixture(html`
        <div id="parent">
          <oryx-notification-center></oryx-notification-center>
        </div>
        <div id="parent1"></div>
        <div id="parent2"></div>
      `);
    });

    it('should find the center', async () => {
      const center = service.getCenter('#parent');
      expect(center).toEqual(document.querySelector(TAG_NAME));
    });

    it('should create if not found', async () => {
      const center = service.getCenter('#parent1');
      expect(center).not.toBeNull();
    });

    it('should create with position', async () => {
      const center = service.getCenter('#parent2', Positions.BOTTOM_END);
      expect(center?.getAttribute('position')).toBe(Positions.BOTTOM_END);
    });

    it('should throw error if parent not found', () => {
      expect(() => service.getCenter('#parent3')).toThrow();
    });
  });
});
