import { expect, fixture, html } from '@open-wc/testing';
import { LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import '../../option/';
import { OptionComponent } from '../../option/';
import { OryxElement } from '../../utilities';
import { FilterController } from './filter.controller';
import { FilterStrategyType, TypeaheadOptions } from './typeahead.model';

export class FakeComponent
  extends LitElement
  implements OryxElement<TypeaheadOptions>
{
  @property({ type: Object }) options: TypeaheadOptions = {};
  protected filterController = new FilterController(this);

  render(): TemplateResult {
    return html` <slot><input value="foo" /></slot> `;
  }
}
customElements.define('fake-filter', FakeComponent);

describe('FilterController', () => {
  let element: FakeComponent;

  let filter: boolean;
  const optionsValues = [
    '/feature/fes-123',
    'fix/fes-456',
    'release/1.0.1-next.0',
    'release/1.0.1-next.1',
  ];

  const itShouldNotFilter = (
    options: TypeaheadOptions,
    value: string,
    event = false
  ): void => {
    beforeEach(async () => {
      element = await fixture(
        html`<fake-filter .options=${options}>
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
    options: TypeaheadOptions,
    count: number,
    value: string,
    event = false
  ): void => {
    describe(`and the control value = "${value}"`, () => {
      beforeEach(async () => {
        element = await fixture(
          html`<fake-filter .options=${options}>
            <input .value=${value} />
            ${optionsValues.map(
              (option) => html`<oryx-option .value=${option}></oryx-option>`
            )}
          </fake-filter>`
        );
      });

      it(`should filter options`, () => {
        if (event) {
          element.dispatchEvent(new Event('input', { bubbles: true }));
        }
        const filteredOptions = element.querySelectorAll<OptionComponent>(
          'oryx-option:not([hide])'
        );
        expect(filteredOptions.length).to.eq(count);
      });
    });
  };

  describe('when filter is not set', () => {
    const options: TypeaheadOptions = {};

    describe('and the control has an initial value', () => {
      itShouldNotFilter(options, 'foo', true);
    });

    describe('and the input event is dispatched', () => {
      itShouldNotFilter(options, '', true);
    });
  });

  describe('when filter is set to true', () => {
    describe('and the strategy is not set', () => {
      const options: TypeaheadOptions = { filter: true };

      describe('and the control has an initial value', () => {
        itShouldFilter(options, 2, 'rel');
      });

      describe('and the control is empty', () => {
        itShouldFilter(options, 4, '');
      });

      describe('and the input event is dispatched', () => {
        filter = true;
        describe('and the control value is "rel"', () => {
          itShouldFilter(options, 2, 'rel', filter);
        });
      });
    });

    describe('and the strategy is set to START_WITH', () => {
      const options: TypeaheadOptions = {
        filter: true,
        filterStrategy: FilterStrategyType.START_WITH,
      };

      describe('and the input event is dispatched', () => {
        itShouldFilter(options, 1, '/', true);
        itShouldFilter(options, 2, 'f', true);
        itShouldFilter(options, 2, 're', true);
      });
    });

    describe('and the strategy is set to START_OF_WORD', () => {
      const options: TypeaheadOptions = {
        filter: true,
        filterStrategy: FilterStrategyType.START_OF_WORD,
      };

      describe('and the input event is dispatched', () => {
        itShouldFilter(options, 4, '/', true);
        itShouldFilter(options, 2, 'fes', true);
        itShouldFilter(options, 2, 'next', true);
        itShouldFilter(options, 2, '-next', true);
        itShouldFilter(options, 0, 'lease', true);
        itShouldFilter(options, 2, '1.0.1-', true);
        itShouldFilter(options, 2, 'f', true);
      });
    });

    describe('and the strategy is set to CONTAINS', () => {
      const options: TypeaheadOptions = {
        filter: true,
        filterStrategy: FilterStrategyType.CONTAINS,
      };

      describe('and the input event is dispatched', () => {
        itShouldFilter(options, 2, 'lease', true);
        itShouldFilter(options, 4, 's', true);
        itShouldFilter(options, 4, '/', true);
        itShouldFilter(options, 2, '/fes', true);
      });
    });
  });
});
