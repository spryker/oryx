import { expect, fixture, html } from '@open-wc/testing';
import { LitElement, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import * as sinon from 'sinon';
import { getControl } from '../../../input';
import '../../../option';
import { OptionComponent } from '../../../option';
import { FilterStrategyType, TypeaheadOptions } from '../typeahead.model';
import { FilterController } from './filter.controller';
@customElement('fake-filter')
class FakeComponent extends LitElement implements TypeaheadOptions {
  @property() filterStrategy?: FilterStrategyType;
  protected filterController = new FilterController(this);
  render(): TemplateResult {
    return html` <slot></slot> `;
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
  const itShouldFilter = (
    count: number,
    value: string,
    event = false,
    strategy?: FilterStrategyType
  ): void => {
    describe(`and the control value = "${value}"`, () => {
      beforeEach(async () => {
        element = await fixture(
          html`<fake-filter .filterStrategy=${strategy}>
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
  describe('when a filter strategy is used', () => {
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
    describe('clear on blur', () => {
      describe('when there is no selected option', () => {
        beforeEach(async () => {
          element = await fixture(
            html`<fake-filter .filterStrategy=${FilterStrategyType.START_WITH}>
              <input value="a value" />
              ${optionsValues.map(
                (option) => html`<oryx-option .value=${option}></oryx-option>`
              )}
            </fake-filter>`
          );
        });
        describe('and a focusout event is dispatched', () => {
          beforeEach(async () => {
            element.dispatchEvent(new Event('focusout', { bubbles: true }));
          });
          it('should clear the value', () => {
            expect(getControl(element)?.value).to.empty;
          });
        });
      });
      describe('when there is a selected option', () => {
        beforeEach(async () => {
          element = await fixture(
            html`<fake-filter .filterStrategy=${FilterStrategyType.START_WITH}>
              <input value="a value" />
              ${optionsValues.map(
                (option) => html`<oryx-option .value=${option}></oryx-option>`
              )}
            </fake-filter>`
          );
          element.querySelectorAll<OptionComponent>('oryx-option')[0].selected =
            true;
        });
        describe('and a focusout event is dispatched', () => {
          beforeEach(async () => {
            element.dispatchEvent(new Event('focusout', { bubbles: true }));
          });
          it('should not clear the value', () => {
            expect(getControl(element)?.value).to.not.empty;
          });
        });
      });
    });
    describe('exact match', () => {
      let callback: unknown;
      const prepareMatchByValue = (value?: string): void => {
        beforeEach(async () => {
          callback = sinon.stub();
          element = await fixture(
            html`<fake-filter
              @oryx.popover=${callback}
              .filterStrategy=${FilterStrategyType.START_WITH}
            >
              ${when(value, () => html`<input value=${value} />`)}
              ${optionsValues.map(
                (option) => html`<oryx-option .value=${option}></oryx-option>`
              )}
            </fake-filter>`
          );
          element.dispatchEvent(
            new InputEvent('input', {
              bubbles: true,
              inputType: 'insertText',
            })
          );
        });
      };
      describe('when an input event value is dispatched', () => {
        prepareMatchByValue('fix/fes-456');
        it('should dispatch a oryx.popover event with a selected option', async () => {
          const selected =
            element.querySelectorAll<HTMLElement>('oryx-option')[1];
          expect(callback).to.be.calledWithMatch(
            sinon.match({ detail: { selected } })
          );
        });
      });
      describe('when an input event value is dispatched', () => {
        prepareMatchByValue('fix/');
        it('should dispatch a oryx.popover event without a selected option', async () => {
          const selected = undefined;
          expect(callback).to.be.calledWithMatch(
            sinon.match({ detail: { selected } })
          );
        });
      });
    });
  });
});
