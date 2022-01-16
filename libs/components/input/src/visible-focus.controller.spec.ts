import { expect, fixture, html } from '@open-wc/testing';
import { LitElement, TemplateResult } from 'lit';
import { VisibleFocusController } from './visible-focus.controller';

export class TestComponent extends LitElement {
  protected visibleFocusController = new VisibleFocusController(this);

  render(): TemplateResult {
    return html`<slot><input /></slot>`;
  }
}
customElements.define('test-control', TestComponent);

describe('VisibleFocusController', () => {
  let element: TestComponent;

  beforeEach(async () => {
    element = await fixture(html`<test-control />`);
  });

  describe('when the user uses the mouse', () => {
    beforeEach(async () => {
      element.dispatchEvent(new Event('mousedown', { bubbles: true }));
    });

    it('should not have a visible-focus attribute ', () => {
      expect(element.hasAttribute('visible-focus')).to.be.false;
    });
  });

  describe('when the keyboard is used', () => {
    beforeEach(async () => {
      element.dispatchEvent(new Event('keyup', { bubbles: true }));
    });

    it('should have a visible-focus attribute ', () => {
      expect(element.hasAttribute('visible-focus')).to.be.true;
    });

    describe('and the control is blurred', () => {
      beforeEach(async () => {
        element.shadowRoot
          ?.querySelector('input')
          ?.dispatchEvent(new Event('blur', { bubbles: true }));
      });

      it('should not have a visible-focus attribute ', () => {
        expect(element.hasAttribute('visible-focus')).to.be.false;
      });
    });
  });
});
