import { fixture, html } from '@open-wc/testing-helpers';
import { LitElement, TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';
import { getControl } from './getControl';

@customElement('fake-component')
class FakeComponent extends LitElement {
  render(): TemplateResult {
    return html`<slot></slot>`;
  }
}

describe('Util', () => {
  let element: FakeComponent;

  describe('When not input element is available', () => {
    beforeEach(async () => {
      element = await fixture(html`<fake-component></fake-component>`);
    });

    it('should throw an error', () => {
      expect(() => getControl(element, 'textarea')).toThrow();
    });
  });

  describe('When an input element is available', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<fake-component><input id="first" /></fake-component>`
      );
    });

    describe('and no selector is used', () => {
      it('should return the input', () => {
        expect(getControl(element).id).toBe('first');
      });
    });

    describe('and the "input" selector is used', () => {
      it('should return the input', () => {
        expect(getControl(element, 'input').id).toBe('first');
      });
    });

    describe('and the "textarea" selector is used', () => {
      it('should throw an error', () => {
        expect(() => getControl(element, 'textarea')).toThrow();
      });
    });
  });

  describe('When two input elements are available', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<fake-component>
          <input id="first" />
          <input id="second" />
        </fake-component>`
      );
    });

    describe('and no selector is used', () => {
      it('should return the first input', () => {
        expect(getControl(element).id).toBe('first');
      });
    });

    describe('and the "input" selector is used', () => {
      it('should return the first input', () => {
        expect(getControl(element, 'input').id).toBe('first');
      });
    });
  });

  describe('When a select element is available', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<fake-component
          ><select id="select">
            <option>test</option>
          </select></fake-component
        >`
      );
    });
    describe('and no selector is used', () => {
      it('should return the select', () => {
        expect(getControl(element).id).toBe('select');
      });
    });

    describe('and the "select" selector is used', () => {
      it('should return the select', () => {
        expect(getControl(element, 'select').id).toBe('select');
      });
    });

    describe('and the "input" selector is used', () => {
      it('should throw an error', () => {
        expect(() => getControl(element, 'input')).toThrow();
      });
    });
  });
});
