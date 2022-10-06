import { elementUpdated, fixture, html } from '@open-wc/testing-helpers';
import { LitElement, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { FilterStrategyType } from '../../../../search/typeahead';
import { SelectOptions } from '../select.model';
import { SelectFilterController } from './select-filter.controller';

@customElement('fake-select')
class FakeComponent extends LitElement implements SelectOptions {
  @property({ type: Boolean }) allowEmptyValue?: boolean;
  @property({ type: Boolean }) isEmpty?: boolean;
  @property({ type: Boolean }) filterSelect?: boolean;
  @property() filterStrategy?: FilterStrategyType;
  protected selectFilterController = new SelectFilterController(this);

  render(): TemplateResult {
    return html`${this.selectFilterController.render()} <slot></slot> `;
  }
}

describe('SelectFilterController', () => {
  let element: FakeComponent;
  let filter: HTMLInputElement;

  describe('with optons', () => {
    describe('when filter strategy is not provided', () => {
      beforeEach(async () => {
        element = await fixture(html`<fake-select>
          <select>
            <option>first</option>
          </select>
        </fake-select>`);
        await elementUpdated(element);
      });

      it('should not add filterSelect attribute', () => {
        expect(element.hasAttribute('filterSelect')).toBe(false);
      });
    });

    describe('when filter strategy is provided', () => {
      beforeEach(async () => {
        element = await fixture(html`<fake-select
          filterStrategy=${FilterStrategyType.START_WITH}
        >
          <select>
            <option value="1">first</option>
            <option value="2" selected>second</option>
          </select>
        </fake-select>`);
        filter = element.shadowRoot?.querySelector(
          '[filterInput]'
        ) as HTMLInputElement;
      });

      it('should add filterSelect attribute', () => {
        expect(element.hasAttribute('filterSelect')).toBe(true);
      });

      it('should set placeholder attribute', () => {
        expect(filter.getAttribute('placeholder')).toBe('first');
      });

      it('should set filtering value from control on first update', () => {
        expect(filter.value).toBe('second');
      });

      it('should set filtering value from control after host update', async () => {
        filter.value = 'dummy';
        element.requestUpdate();
        await elementUpdated(element);
        expect(filter.value).toBe('second');
      });

      it('should not set filtering value from control when host is empty after update', async () => {
        filter.value = 'dummy';
        element.setAttribute('isEmpty', 'true');
        element.requestUpdate();
        await elementUpdated(element);
        expect(filter.value).toBe('dummy');
      });
    });
  });

  describe('without options', () => {
    describe('when filter strategy is provided', () => {
      beforeEach(async () => {
        element = await fixture(html`<fake-select
          filterStrategy=${FilterStrategyType.START_WITH}
        >
          <select></select>
        </fake-select>`);
        await elementUpdated(element);
        filter = element.shadowRoot?.querySelector(
          '[filterInput]'
        ) as HTMLInputElement;
      });

      it('should set placeholder attribute', () => {
        expect(filter.getAttribute('placeholder')).toBe('');
      });
    });
  });
});
