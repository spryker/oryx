import { elementUpdated, fixture, html } from '@open-wc/testing-helpers';
import { signal, signalAware } from '@spryker-oryx/utilities';
import { LitElement, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { of } from 'rxjs';
import { getControl } from '../../../utilities';
import { SelectController } from './select.controller';

@customElement('fake-typeahead')
class FakeComponent extends LitElement {
  @property({ type: Boolean }) isEmpty?: boolean;
  protected selectController = new SelectController(this);

  render(): TemplateResult {
    return html` <slot></slot> `;
  }
}

@customElement('fake-signal')
@signalAware()
class FakeSignalComponent extends LitElement {
  protected $option = signal(of(['first']));

  render(): TemplateResult {
    return html`<fake-typeahead>
      <select>
        ${this.$option().map((item) => html`<option>${item}</option`)}
      </select>
    </fake-typeahead>`;
  }
}

describe('SelectController', () => {
  let element: FakeComponent;

  describe('readonly', () => {
    describe('when an input control is used', () => {
      beforeEach(async () => {
        element = await fixture(
          html`
            <fake-typeahead>
              <input value="foo" />
            </fake-typeahead>
          `
        );
      });

      it('should make the control readonly', () => {
        expect(getControl(element).hasAttribute('readonly')).toBe(true);
      });
    });

    describe('when a select control is used', () => {
      beforeEach(async () => {
        element = await fixture(
          html`
            <fake-typeahead>
              <select></select>
            </fake-typeahead>
          `
        );
      });

      it('should make the control readonly', () => {
        expect(getControl(element).hasAttribute('readonly')).toBe(false);
      });
    });
  });

  describe('reflect options', () => {
    describe('when a select is provided', () => {
      beforeEach(async () => {
        element = await fixture(
          html`
            <fake-typeahead>
              <select>
                <option>first</option>
                <option value="second"></option>
                <option value="third" selected>third option text</option>
              </select>
            </fake-typeahead>
          `
        );
      });

      it('should generate 3 elements', () => {
        expect(
          element.querySelectorAll('*:not(select):not(option)').length
        ).toBe(3);
      });

      describe('and options are asynchronous added later', () => {
        beforeEach(async () => {
          const option = document.createElement('option');
          option.value = 'fourth';
          option.innerText = 'fourth option';
          element.querySelector('select')?.appendChild(option);
        });

        it('should generate 4 elements', () => {
          expect(element.querySelectorAll('oryx-option').length).toBe(4);
        });
      });
    });
  });

  describe('render via signal', () => {
    beforeEach(async () => {
      element = await fixture(html` <fake-signal></fake-signal> `);
      await elementUpdated(element);
    });

    it('should generate 1 element', () => {
      expect(
        element.shadowRoot
          ?.querySelector('fake-typeahead')
          ?.querySelectorAll('oryx-option').length
      ).toBe(1);
    });
  });
});
