import { fixture, html } from '@open-wc/testing-helpers';
import { OptionComponent } from '@spryker-oryx/ui/option';
import { POPOVER_EVENT } from '@spryker-oryx/ui/popover';
import { LitElement, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { SpyInstance } from 'vitest';
import { getControl } from '../../../../form/utilities/getControl';
import { FilterStrategyType, TypeaheadOptions } from '../typeahead.model';
import { FilterController } from './filter.controller';

@customElement('fake-filter')
class FakeComponent extends LitElement implements TypeaheadOptions {
  @property() filterStrategy?: FilterStrategyType;
  protected filterController = new FilterController(this);
  render(): TemplateResult {
    return html` <input filterInput /><slot></slot> `;
  }
}
@customElement('fake-filter-select')
class FakeFilterSelectComponent extends LitElement implements TypeaheadOptions {
  @property() filterStrategy?: FilterStrategyType;
  protected filterController = new FilterController(this);

  updated(): void {
    this.setAttribute('filterSelect', 'true');

    const inputValue = this.querySelector('input')?.value;
    const filterInput = this.renderRoot.querySelector(
      '[filterInput]'
    ) as HTMLInputElement;
    filterInput.value = inputValue || '';
  }

  render(): TemplateResult {
    return html` <input filterInput /><slot></slot> `;
  }
}
describe('FilterController', () => {
  let element: FakeComponent;
  let selectElement: FakeFilterSelectComponent;
  let input: HTMLInputElement;
  const optionsValues = [
    '/feature/fes-123',
    'fix/fes-456',
    'release/1.0.1-next.0',
    'release/1.0.1-next.1',
  ];
  const filteredOptions = (): NodeListOf<OptionComponent> => {
    return element.querySelectorAll<OptionComponent>('oryx-option:not([hide])');
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
        expect(filteredOptions().length).toBe(count);
      });
    });
  };

  const itShouldNotFilter = (): void => {
    it(`should not filter options`, () => {
      if (event) {
        element.dispatchEvent(
          new InputEvent('input', {
            bubbles: true,
            inputType: 'insertText',
          })
        );
      }
      expect(filteredOptions().length).toBe(optionsValues.length);
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
    describe('backspace handling', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<fake-filter
            .filterStrategy=${FilterStrategyType.START_OF_WORD}
            filterSelect
          >
            <input value="fes" />
            ${optionsValues.map(
              (option) => html`<oryx-option .value=${option}></oryx-option>`
            )}
          </fake-filter>`
        );
        input = element.shadowRoot?.querySelector(
          '[filterInput]'
        ) as HTMLInputElement;
      });
      it('should have initial filter applied', () => {
        input.value = 'fes-1';
        element.dispatchEvent(
          new InputEvent('input', { bubbles: true, inputType: 'insertText' })
        );
        expect(filteredOptions().length).toBe(1);
      });
      describe('and user uses backspace', () => {
        it('should still filter if input has value', () => {
          input.value = 'fes-';
          element.dispatchEvent(
            new InputEvent('input', {
              bubbles: true,
              inputType: 'deleteContentBackward',
            })
          );
          expect(filteredOptions().length).toBe(2);
        });
        it('should reset filter if input has no value', () => {
          input.value = '';
          element.dispatchEvent(
            new InputEvent('input', {
              bubbles: true,
              inputType: 'deleteContentBackward',
            })
          );
          expect(filteredOptions().length).toBe(4);
        });
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
            expect(getControl(element).value).toBe('');
          });
          itShouldNotFilter();
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
          element.querySelectorAll<OptionComponent>('oryx-option')[0].active =
            true;
        });
        describe('and a focusout event is dispatched', () => {
          beforeEach(async () => {
            element.dispatchEvent(new Event('focusout', { bubbles: true }));
          });
          it('should not clear the value', () => {
            expect(getControl(element).value).not.toBe('');
          });
        });
      });
    });
    describe('exact match', () => {
      let callback: SpyInstance;
      const prepareMatchByValue = (value?: string): void => {
        beforeEach(async () => {
          callback = vi.fn();
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
          element.querySelector('input')?.focus();
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

        it(`should dispatch a ${POPOVER_EVENT} event with a selected option`, async () => {
          const selected =
            element.querySelectorAll<HTMLElement>('oryx-option')[1];
          expect(callback.mock.calls[0][0].detail.selected).toBe(selected);
        });
      });
      describe('when an input event value is dispatched', () => {
        prepareMatchByValue('fix/');

        it(`should dispatch a ${POPOVER_EVENT} event without a selected option`, async () => {
          expect(callback.mock.calls[0][0].detail.selected).toBeUndefined();
        });
      });
    });
    describe('and the user starts using the space bar', () => {
      let spy: SpyInstance<Event[]>;

      const event = new KeyboardEvent('keydown', {
        key: ' ',
        bubbles: true,
        composed: true,
      });

      describe('and the value is empty', () => {
        beforeEach(async () => {
          element = await fixture(
            html`<fake-filter .filterStrategy=${FilterStrategyType.START_WITH}>
              <input value="" />
              ${optionsValues.map(
                (option) => html`<oryx-option .value=${option}></oryx-option>`
              )}
            </fake-filter>`
          );
        });

        it('should not add the value', () => {
          spy = vi.spyOn(event, 'preventDefault');
          element.dispatchEvent(event);
          expect(spy).toHaveBeenCalled();
        });
      });

      describe('and the value is not empty', () => {
        beforeEach(async () => {
          element = await fixture(
            html`<fake-filter .filterStrategy=${FilterStrategyType.START_WITH}>
              <input value="not empty" />
              ${optionsValues.map(
                (option) => html`<oryx-option .value=${option}></oryx-option>`
              )}
            </fake-filter>`
          );
        });

        it('should not add the value', () => {
          const event = new KeyboardEvent('keydown', {
            key: ' ',
            bubbles: true,
            composed: true,
          });
          spy = vi.spyOn(event, 'preventDefault');
          element.dispatchEvent(event);
          expect(spy).not.toHaveBeenCalled();
        });
      });

      describe('and select filter is used', () => {
        describe('and the value is empty', () => {
          beforeEach(async () => {
            selectElement = await fixture(
              html`<fake-filter-select
                .filterStrategy=${FilterStrategyType.START_WITH}
              >
                <input value="" />
                ${optionsValues.map(
                  (option) => html`<oryx-option .value=${option}></oryx-option>`
                )}
              </fake-filter-select>`
            );
          });

          it('should not add the value', () => {
            spy = vi.spyOn(event, 'preventDefault');
            selectElement.dispatchEvent(event);
            expect(spy).toHaveBeenCalled();
          });
        });

        describe('and the value is not empty', () => {
          beforeEach(async () => {
            selectElement = await fixture(
              html`<fake-filter-select
                .filterStrategy=${FilterStrategyType.START_WITH}
              >
                <input value="not empty" />
                ${optionsValues.map(
                  (option) => html`<oryx-option .value=${option}></oryx-option>`
                )}
              </fake-filter-select>`
            );
          });

          it('should not add the value', () => {
            const event = new KeyboardEvent('keydown', {
              key: ' ',
              bubbles: true,
              composed: true,
            });
            spy = vi.spyOn(event, 'preventDefault');
            selectElement.dispatchEvent(event);
            expect(spy).not.toHaveBeenCalled();
          });
        });
      });
    });
  });
});
