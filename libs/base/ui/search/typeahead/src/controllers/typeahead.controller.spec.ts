import { getShadowElementBySelector } from '@/tools/testing';
import { fixture, html } from '@open-wc/testing-helpers';
import { optionComponent } from '@spryker-oryx/ui';
import { PopoverSelectEvent } from '@spryker-oryx/ui/popover';
import { SearchEventDetail } from '@spryker-oryx/ui/searchbox';
import { a11yConfig, useComponent } from '@spryker-oryx/utilities';
import { LitElement, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { SpyInstance } from 'vitest';
import { getControl } from '../../../../form/utilities';
import { FilterStrategyType, TypeaheadOptions } from '../typeahead.model';
import { TypeaheadController } from './typeahead.controller';

@customElement('fake-typeahead')
class FakeComponent extends LitElement implements TypeaheadOptions {
  @property({ type: Boolean }) filter?: boolean;
  @property() filterStrategy?: FilterStrategyType;
  @property({ type: Boolean }) isLoading?: boolean;
  @property({ type: Boolean }) isEmpty?: boolean;
  @property() emptyMessage?: string;

  protected popoverController = new TypeaheadController(this);

  render(): TemplateResult {
    return html`
      <slot><input value="foo" /></slot>
      <div>inner-value</div>
      <oryx-option value="option-value"></oryx-option>
    `;
  }
}

describe('TypeaheadController', () => {
  let element: FakeComponent;

  beforeAll(async () => {
    await useComponent(optionComponent);
  });

  describe('slot', () => {
    describe('when oryx-option elements without a slot are provided', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<fake-typeahead>
            <input value="foo" aria-label="make a11y happy" />
            <oryx-option>first</oryx-option>
            <oryx-option>second</oryx-option>
            <oryx-option>third</oryx-option>
          </fake-typeahead>`
        );
      });

      it('passes the a11y audit', async () => {
        await expect(element).shadowDom.to.be.accessible(a11yConfig);
      });

      it('should add the option slot to it', () => {
        expect(
          element.querySelectorAll('oryx-option[slot=option]').length
        ).toBe(3);
      });

      it('should add "close-popover" attribute', () => {
        expect(
          element.querySelectorAll('oryx-option[close-popover]').length
        ).toBe(3);
      });
    });

    describe('when oryx-option elements with a slot are provided', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<fake-typeahead>
            <input value="foo" aria-label="make a11y happy" />
            <oryx-option slot="other">first</oryx-option>
            <oryx-option slot="other">second</oryx-option>
            <oryx-option slot="other">third</oryx-option>
          </fake-typeahead>`
        );
      });

      it('passes the a11y audit', async () => {
        await expect(element).shadowDom.to.be.accessible(a11yConfig);
      });

      it('should add the option slot to it', () => {
        expect(
          element.querySelectorAll('oryx-option[slot=option]').length
        ).toBe(0);
      });
    });
  });

  describe('when an input is dispatched', () => {
    let result: SearchEventDetail;

    beforeEach(async () => {
      document.body.appendChild(element);
      element.addEventListener('oryx.typeahead', ((
        ev: CustomEvent<SearchEventDetail>
      ) => {
        result = ev.detail;
      }) as EventListener);
      element.dispatchEvent(new Event('input', { bubbles: true }));
    });

    it('should dispatch a "oryx.typeahead" event', () => {
      expect(result.query).toBe('foo');
    });
  });

  describe('"oryx.select" event', () => {
    let onChange: SpyInstance;
    let onInput: SpyInstance;

    afterEach(() => {
      vi.clearAllMocks();
    });

    const dispatchSelectEvent = (): void => {
      const selected = getShadowElementBySelector(
        element,
        'oryx-option'
      ) as HTMLElement;
      const event = new CustomEvent<PopoverSelectEvent>('oryx.select', {
        detail: { selected },
        bubbles: true,
        composed: true,
      });
      element.dispatchEvent(event);
    };

    const prepareComponent = async (control: TemplateResult): Promise<void> => {
      onChange = vi.fn();
      onInput = vi.fn();

      element = await fixture(
        html`<fake-typeahead @change=${onChange} @input=${onInput}>
          ${control}
        </fake-typeahead>`
      );
    };

    describe('when a select is used', () => {
      describe('and the selected option is reselected', () => {
        beforeEach(async () => {
          prepareComponent(
            html`<select>
              <option value="option-value"></option>
            </select>`
          );
        });
        describe('and the "oryx.select" event is dispatched', () => {
          beforeEach(() => {
            dispatchSelectEvent();
          });
          it('should not dispatch the change event', () => {
            expect(onChange).not.toHaveBeenCalled();
          });
          it('should not dispatch the input event for select element', () => {
            expect(onInput).not.toHaveBeenCalled();
          });
        });
      });

      describe('and a new option is selected', () => {
        beforeEach(async () => {
          await prepareComponent(
            html`<select>
              <option value="new-value"></option>
            </select>`
          );
        });
        describe('and the "oryx.select" event is dispatched', () => {
          beforeEach(() => {
            dispatchSelectEvent();
          });
          it('should dispatch the change event', () => {
            expect(onChange).toHaveBeenCalled();
          });
          it('should not dispatch the input event for select element', () => {
            expect(onInput).not.toHaveBeenCalled();
          });
        });
      });
    });

    describe('when an input is used', () => {
      describe('and there is no initial value for the input', () => {
        beforeEach(async () => {
          await prepareComponent(html`<input />`);
        });
        describe('and the "oryx.select" event is dispatched', () => {
          beforeEach(() => {
            dispatchSelectEvent();
          });
          it('should dispatch the input event', () => {
            expect(onInput).toHaveBeenCalled();
          });
          it('should not dispatch the change event for input element', () => {
            expect(onChange).not.toHaveBeenCalled();
          });
        });
      });

      describe('and the input value is not equal to the selected value', () => {
        beforeEach(async () => {
          await prepareComponent(html`<input value="different" />`);
        });
        describe('and the "oryx.select" event is dispatched', () => {
          beforeEach(() => {
            dispatchSelectEvent();
          });
          it('should dispatch the input event', () => {
            expect(onInput).toHaveBeenCalled();
          });
          it('should not dispatch the change event', () => {
            expect(onChange).not.toHaveBeenCalled();
          });
        });
      });

      describe('and the input value is already the selected value', () => {
        beforeEach(async () => {
          await prepareComponent(html`<input value="option-value" />`);
        });
        describe('and the "oryx.select" event is dispatched', () => {
          beforeEach(() => {
            dispatchSelectEvent();
          });
          it('should dispatch the input event', () => {
            expect(onInput).toHaveBeenCalled();
          });
          it('should not dispatch the change event', () => {
            expect(onChange).not.toHaveBeenCalled();
          });
        });

        describe('and value has changed', () => {
          beforeEach(() => {
            getControl(element).value = 'changed';
          });
          describe('and the "oryx.select" event is dispatched', () => {
            beforeEach(() => {
              dispatchSelectEvent();
            });
            it('should set the value', () => {
              expect(getControl(element).value).toBe('option-value');
            });
          });
        });
      });
    });
  });
});
