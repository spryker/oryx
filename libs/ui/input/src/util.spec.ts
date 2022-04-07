import { expect, fixture, html } from '@open-wc/testing';
import { LitElement, TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';
import { getControl } from './util';

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
      expect(() => getControl(element, 'textarea')).to.throw();
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
        expect(getControl(element).id).to.eq('first');
      });
    });

    describe('and the "input" selector is used', () => {
      it('should return the input', () => {
        expect(getControl(element, 'input').id).to.eq('first');
      });
    });

    describe('and the "textarea" selector is used', () => {
      it('should throw an error', () => {
        expect(() => getControl(element, 'textarea')).to.throw();
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
        expect(getControl(element).id).to.eq('first');
      });
    });

    describe('and the "input" selector is used', () => {
      it('should return the first input', () => {
        expect(getControl(element, 'input').id).to.eq('first');
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
        expect(getControl(element).id).to.eq('select');
      });
    });

    describe('and the "select" selector is used', () => {
      it('should return the select', () => {
        expect(getControl(element, 'select').id).to.eq('select');
      });
    });

    describe('and the "input" selector is used', () => {
      it('should throw an error', () => {
        expect(() => getControl(element, 'input')).to.throw();
      });
    });
  });
});
