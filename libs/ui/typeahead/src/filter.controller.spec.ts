import { expect, fixture, html } from '@open-wc/testing';
import { LitElement, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import '../../option/';
import { OptionComponent } from '../../option/';
import { FilterController } from './filter.controller';
import { FilterStrategyType, TypeaheadOptions } from './typeahead.model';

@customElement('fake-filter')
class FakeComponent extends LitElement implements TypeaheadOptions {
  @property({ type: Boolean }) filter?: boolean;
  @property({ type: Number }) filterStrategy?: FilterStrategyType;

  protected filterController = new FilterController(this);

  render(): TemplateResult {
    return html` <slot><input value="foo" /></slot> `;
  }
}

describe('FilterController', () => {
  let element: FakeComponent;

  const optionsValues = [
    '/feature/fes-123',
    'fix/fes-456',
    'release/1.0.1-next.0',
    'release/1.0.1-next.1',
  ];

  const itShouldNotFilter = (value: string, event = false): void => {
    beforeEach(async () => {
      element = await fixture(
        html`<fake-filter>
          <input .value=${value} />
          ${optionsValues.map(
            (option) => html`<oryx-option .value=${option}></oryx-option>`
          )}
        </fake-filter>`
      );
      if (event) {
        element.dispatchEvent(new Event('input', { bubbles: true }));
      }
    });

    it(`should not filter the options`, () => {
      expect(element.querySelectorAll('oryx-option:not([hide])').length).to.eq(
        optionsValues.length
      );
    });
  };

  const itShouldFilter = (
    count: number,
    value: string,
    event = false,
    strategy?: FilterStrategyType
  ): void => {
    describe(`and the control value = "${value}"`, () => {
      beforeEach(async () => {
        element = await fixture(
          html`<fake-filter ?filter=${true} .filterStrategy=${strategy}>
            <input .value=${value} />
            ${optionsValues.map(
              (option) => html`<oryx-option .value=${option}></oryx-option>`
            )}
          </fake-filter>`
        );
      });

      it(`should filter options`, () => {
        if (event) {
          element.dispatchEvent(
            new InputEvent('input', { bubbles: true, inputType: 'insertText' })
          );
        }
        const filteredOptions = element.querySelectorAll<OptionComponent>(
          'oryx-option:not([hide])'
        );
        expect(filteredOptions.length).to.eq(count);
      });
    });
  };

  describe('when filter is not set', () => {
    describe('and the control has an initial value', () => {
      itShouldNotFilter('foo', true);
    });

    describe('and the input event is dispatched', () => {
      itShouldNotFilter('', true);
    });
  });

  describe('when filter is set to true', () => {
    describe('and the strategy is not set', () => {
      describe('and the control has an initial value', () => {
        itShouldFilter(2, 'rel');
      });

      describe('and the control is empty', () => {
        itShouldFilter(4, '');
      });

      describe('and the input event is dispatched', () => {
        describe('and the control value is "rel"', () => {
          itShouldFilter(2, 'rel', true);
        });
      });
    });

    describe('and the strategy is set to START_WITH', () => {
      describe('and the input event is dispatched', () => {
        itShouldFilter(1, '/', true, FilterStrategyType.START_WITH);
        itShouldFilter(2, 'f', true, FilterStrategyType.START_WITH);
        itShouldFilter(2, 're', true, FilterStrategyType.START_WITH);
      });
    });

    describe('and the strategy is set to START_OF_WORD', () => {
      describe('and the input event is dispatched', () => {
        itShouldFilter(4, '/', true, FilterStrategyType.START_OF_WORD);
        itShouldFilter(2, 'fes', true, FilterStrategyType.START_OF_WORD);
        itShouldFilter(2, 'next', true, FilterStrategyType.START_OF_WORD);
        itShouldFilter(2, '-next', true, FilterStrategyType.START_OF_WORD);
        itShouldFilter(0, 'lease', true, FilterStrategyType.START_OF_WORD);
        itShouldFilter(2, '1.0.1-', true, FilterStrategyType.START_OF_WORD);
        itShouldFilter(2, 'f', true, FilterStrategyType.START_OF_WORD);
      });
    });

    describe('and the strategy is set to CONTAINS', () => {
      describe('and the input event is dispatched', () => {
        itShouldFilter(2, 'lease', true, FilterStrategyType.CONTAINS);
        itShouldFilter(4, 's', true, FilterStrategyType.CONTAINS);
        itShouldFilter(4, '/', true, FilterStrategyType.CONTAINS);
        itShouldFilter(2, '/fes', true, FilterStrategyType.CONTAINS);
      });
    });
  });
});
