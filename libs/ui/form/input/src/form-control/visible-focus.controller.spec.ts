import { fixture, html } from '@open-wc/testing-helpers';
import '@spryker-oryx/testing';
import { a11yConfig } from '@spryker-oryx/typescript-utils';
import { LitElement, TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';
import { VisibleFocusController } from './visible-focus.controller';

@customElement('test-control')
export class TestComponent extends LitElement {
  protected visibleFocusController = new VisibleFocusController(this);

  render(): TemplateResult {
    return html`<slot><input aria-label="some label" /></slot>`;
  }
}

describe('VisibleFocusController', () => {
  let element: TestComponent;

  beforeEach(async () => {
    element = await fixture(html`<test-control />`);
  });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible(a11yConfig);
  });

  describe('when the user uses the mouse', () => {
    beforeEach(async () => {
      element.dispatchEvent(new Event('mousedown', { bubbles: true }));
    });

    it('should not have a visible-focus attribute ', () => {
      expect(element.hasAttribute('visible-focus')).toBe(false);
    });
  });

  describe('when the keyboard is used', () => {
    beforeEach(async () => {
      element.dispatchEvent(new Event('keyup', { bubbles: true }));
    });

    it('should have a visible-focus attribute ', () => {
      expect(element.hasAttribute('visible-focus')).toBe(true);
    });

    describe('and the control is blurred', () => {
      beforeEach(async () => {
        element.shadowRoot
          ?.querySelector('input')
          ?.dispatchEvent(new Event('blur', { bubbles: true }));
      });

      it('should not have a visible-focus attribute ', () => {
        expect(element.hasAttribute('visible-focus')).toBe(false);
      });
    });
  });
});
