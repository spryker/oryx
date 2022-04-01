import { expect, fixture, html } from '@open-wc/testing';
import { NotificationService, Positions, TAG_NAME } from '..';
import '../index';

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
      expect(center).to.be.eq(document.querySelector(TAG_NAME));
    });

    it('should create if not found', async () => {
      const center = service.getCenter('#parent1');
      expect(center).to.be.exist;
    });

    it('should create with position', async () => {
      const center = service.getCenter('#parent2', Positions.BOTTOM_END);
      expect(center?.getAttribute('position')).to.be.eq(Positions.BOTTOM_END);
    });

    it('should throw error if parent not found', () => {
      expect(() => service.getCenter('#parent3')).to.throw();
    });
  });
});
