import { expect, fixture, html } from '@open-wc/testing';
import * as sinon from 'sinon';
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
      expect(element.querySelector('#light-dom')).to.exist;
    });
  });

  describe('when a mousedown event is dispatched on the popover', () => {
    it('should prevent the default event from bubbling', () => {
      const event = new Event('mousedown', {
        bubbles: true,
      });
      const expectation = sinon.mock(event).expects('preventDefault').once();
      element?.dispatchEvent(event);
      expectation.verify();
    });
    it('should stop the propagation for the event', () => {
      const event = new Event('mousedown', {
        bubbles: true,
      });
      const expectation = sinon.mock(event).expects('stopPropagation').once();
      element?.dispatchEvent(event);
      expectation.verify();
    });
  });

  describe('when a mouseup event is dispatched on the popover', () => {
    it('should prevent the default event from bubbling', () => {
      const event = new Event('mouseup', {
        bubbles: true,
      });
      const expectation = sinon.mock(event).expects('preventDefault').once();
      element?.dispatchEvent(event);
      expectation.verify();
    });
    it('should stop the propagation for the event', () => {
      const event = new Event('mouseup', {
        bubbles: true,
      });
      const expectation = sinon.mock(event).expects('stopPropagation').once();
      element?.dispatchEvent(event);
      expectation.verify();
    });
  });
});
