import { fixture, html } from '@open-wc/testing-helpers';
import '@spryker-oryx/testing';
import { PopoverComponent } from '.';
import { a11yConfig } from '../../a11y';
import './index';

describe('PopoverComponent', () => {
  let element: PopoverComponent;

  describe('when light dom is added to the default slot', () => {
    beforeEach(async () => {
      element = await fixture(html`<oryx-popover>
        <div id="light-dom">popover content</div>
      </oryx-popover>`);
    });

    it('passes the a11y audit', async () => {
      await expect(element).shadowDom.to.be.accessible(a11yConfig);
    });

    it('should render the light dom content', () => {
      expect(element.querySelector('#light-dom')).not.toBeNull();
    });
  });

  describe('when a mousedown event is dispatched on the popover', () => {
    it('should prevent the default event from bubbling', () => {
      const event = new Event('mousedown', {
        bubbles: true,
      });

      const expectation = vi.spyOn(event, 'preventDefault');
      element?.dispatchEvent(event);
      expect(expectation).toHaveBeenCalled();
    });
    it('should stop the propagation for the event', () => {
      const event = new Event('mousedown', {
        bubbles: true,
      });
      const expectation = vi.spyOn(event, 'stopPropagation');
      element?.dispatchEvent(event);
      expect(expectation).toHaveBeenCalledOnce();
    });
  });

  describe('when a mouseup event is dispatched on the popover', () => {
    it('should prevent the default event from bubbling', () => {
      const event = new Event('mouseup', {
        bubbles: true,
      });
      const expectation = vi.spyOn(event, 'preventDefault');
      element?.dispatchEvent(event);
      expect(expectation).toHaveBeenCalledOnce();
    });
    it('should stop the propagation for the event', () => {
      const event = new Event('mouseup', {
        bubbles: true,
      });
      const expectation = vi.spyOn(event, 'stopPropagation');
      element?.dispatchEvent(event);
      expect(expectation).toHaveBeenCalledOnce();
    });
  });
});
