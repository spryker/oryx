import { fixture } from '@open-wc/testing-helpers';
import { html, LitElement, TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';
import { ScrollingAreaController } from './scrolling-area.controller';

const containerHeight = 200;

@customElement('fake-container')
class FakeContainer extends LitElement {
  controller = new ScrollingAreaController(this);

  render(): TemplateResult {
    return html` <slot name="option"></slot> `;
  }
}

describe('ScrollingAreaController', () => {
  let element: FakeContainer;

  const simulateScroll = (scrollPower: number): void => {
    const scrollContainer = element.querySelector(
      '[slot="option"] > *'
    ) as HTMLDivElement;

    (scrollContainer.scrollHeight as any) = scrollPower;
    scrollContainer.scrollTop = 20;
    scrollContainer?.dispatchEvent(new CustomEvent('scroll'));

    element.getBoundingClientRect = (): any => ({ height: containerHeight });
    element.controller.setScrollAttributes(scrollContainer);
  };

  describe('when scrolling container is provided', () => {
    beforeAll(async () => {
      element = await fixture(html`
        <fake-container>
          <div slot="option" style="height: 20px; overflow: hidden;">
            <div style="height: 200px;"></div>
          </div>
        </fake-container>
      `);

      simulateScroll(200);
    });

    it('should add attributes', () => {
      expect(element.hasAttribute('scrollable-top')).toBe(true);
      expect(element.hasAttribute('scrollable-bottom')).toBe(true);
    });
  });

  describe('when scrolling container is not provided', () => {
    beforeAll(async () => {
      element = await fixture(html`
        <fake-container scrollable-top scrollable-bottom></fake-container>
      `);

      element.controller.setScrollAttributes(null);
    });

    it('should drop the attributes', () => {
      expect(element.hasAttribute('scrollable-top')).toBe(false);
      expect(element.hasAttribute('scrollable-bottom')).toBe(false);
    });
  });
});
