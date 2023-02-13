import { fixture } from '@open-wc/testing-helpers';
import { a11yConfig } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';
import { SelectedController } from './selected.controller';

@customElement('fake-selected')
class FakeComponent extends LitElement {
  controller = new SelectedController(this, 'li');

  render(): TemplateResult {
    return html` <slot></slot>`;
  }
}

describe('SelectedController', () => {
  let element: FakeComponent;

  beforeEach(async () => {
    element = await fixture(html` <fake-selected>
      <ol>
        <li>first</li>
        <li>second</li>
      </ol>
    </fake-selected>`);
  });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible(a11yConfig);
  });

  describe('when the 1st item is selected', () => {
    beforeEach(() => {
      element.controller.select(0);
    });

    it('should have selected attribute', () => {
      expect(
        element.querySelector<HTMLElement>('[active]')?.textContent
      ).toContain('first');
    });
  });

  describe('when the 2nd item is selected', () => {
    beforeEach(() => {
      element.controller.select(1);
    });

    it('should have selected attribute', () => {
      expect(
        element.querySelector<HTMLElement>('[active]')?.textContent
      ).toContain('second');
    });
  });

  describe('when the an unknown item is selected', () => {
    beforeEach(() => {
      element.controller.select(10);
    });

    it('should not throw an error', () => {
      if (element) {
        expect(() => {
          (): void => undefined;
        }).not.toThrow();
      }
    });
  });

  describe('when the the items are deselected', () => {
    beforeEach(() => {
      element.controller.deselect();
    });

    it('should not have selected attribute', () => {
      expect(element.querySelectorAll<HTMLElement>('[selected]').length).toBe(
        0
      );
    });
  });

  describe('when the mouseup event is dispatched on an item', () => {
    let item: HTMLElement;
    beforeEach(() => {
      item = element.querySelectorAll<HTMLElement>('li')?.[0];
      item.dispatchEvent(new Event('mouseup', { bubbles: true }));
    });

    afterEach(() => {
      item.removeAttribute('selected');
    });

    it('should select the item', () => {
      expect(item.hasAttribute('active')).toBeTruthy();
    });
  });

  describe('when the mouseup event is dispatched on the host', () => {
    beforeEach(() => {
      element.dispatchEvent(new Event('mouseup', { bubbles: true }));
    });

    it('should not have a select the item', () => {
      expect(element.querySelectorAll<HTMLElement>('[selected]').length).toBe(
        0
      );
    });
  });

  describe('when the host is disconnected', () => {
    beforeEach(async () => {
      element = await fixture(html`
        <fake-selected show>
          <oryx-option>first</oryx-option>
          <oryx-option>second</oryx-option>
        </fake-selected>
      `);
      //simulate disconnect hook
      element.controller.hostDisconnected();

      element
        .querySelector('oryx-option')
        ?.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
    });

    it('should not select elements', () => {
      expect(element.querySelector('[selected]')).toBe(null);
    });
  });
});
