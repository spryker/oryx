import { expect, fixture } from '@open-wc/testing';
import { html, LitElement, TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';
import { a11yConfig } from '../../../a11y';
import { SelectedController } from './selected.controller';

@customElement('fake-selected')
class FakeComponent extends LitElement {
  controller = new SelectedController(this, 'li');

  render(): TemplateResult {
    return html`<slot></slot>`;
  }
}

describe('SelectedController', () => {
  let element: FakeComponent;

  beforeEach(async () => {
    element = await fixture(html`<fake-selected>
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
      expect(element.querySelector<HTMLElement>('[selected]')?.innerText).to.eq(
        'first'
      );
    });
  });

  describe('when the 2nd item is selected', () => {
    beforeEach(() => {
      element.controller.select(1);
    });

    it('should have selected attribute', () => {
      expect(element.querySelector<HTMLElement>('[selected]')?.innerText).to.eq(
        'second'
      );
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
        }).not.to.throw;
      }
    });
  });

  describe('when the the items are deselected', () => {
    beforeEach(() => {
      element.controller.deselect();
    });

    it('should not have selected attribute', () => {
      expect(element.querySelectorAll<HTMLElement>('[selected]').length).to.eq(
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

    it('should select the item', () => {
      expect(item.hasAttribute('selected')).to.be.true;
    });
  });

  describe('when the mouseup event is dispatched on the host', () => {
    beforeEach(() => {
      element.dispatchEvent(new Event('mouseup', { bubbles: true }));
    });

    it('should not have a select the item', () => {
      expect(element.querySelectorAll<HTMLElement>('[selected]').length).to.eq(
        0
      );
    });
  });
});
