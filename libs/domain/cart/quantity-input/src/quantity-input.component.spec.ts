import { fixture } from '@open-wc/testing-helpers';
import { useComponent } from '@spryker-oryx/core/utilities';
import { destroyInjector } from '@spryker-oryx/di';
import { iconComponent } from '@spryker-oryx/ui';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { html } from 'lit';
import { QuantityInputComponent } from './quantity-input.component';
import { quantityInputComponent } from './quantity-input.def';

describe('QuantityInputComponent', () => {
  let element: QuantityInputComponent;

  const getInput = (): HTMLInputElement => {
    return element.renderRoot.querySelector('input') as HTMLInputElement;
  };

  beforeAll(async () => {
    await useComponent([quantityInputComponent, iconComponent]);
  });

  afterEach(() => {
    destroyInjector();
    vi.resetAllMocks();
  });

  describe('events', () => {
    const updateCallback = vi.fn();
    const submitCallback = vi.fn();
    let increaseButton: HTMLButtonElement;
    let decreaseButton: HTMLButtonElement;

    beforeEach(async () => {
      element = await fixture(
        html`<oryx-cart-quantity-input
          value="5"
          @update=${updateCallback}
          @submit=${submitCallback}
        >
        </oryx-cart-quantity-input>`
      );
      increaseButton = element.shadowRoot?.querySelector(
        `button[part='increase']`
      ) as HTMLButtonElement;
      decreaseButton = element.renderRoot.querySelector(
        `button[part='decrease']`
      ) as HTMLButtonElement;
    });

    describe('when an input event is dispatched', () => {
      beforeEach(() => {
        getInput().dispatchEvent(new InputEvent('input', { bubbles: true }));
      });

      it('should dispatch update events', () => {
        expect(updateCallback).toHaveBeenCalledTimes(1);
      });

      it('should not dispatch submit events', () => {
        expect(submitCallback).not.toHaveBeenCalled();
      });
    });

    describe('keydown', () => {
      describe('when the input is valid', () => {
        describe('and the Enter keydown is dispatched', () => {
          beforeEach(() => {
            vi.spyOn(getInput(), 'reportValidity');

            getInput().dispatchEvent(
              new KeyboardEvent('keydown', {
                key: 'Enter',
                bubbles: true,
              })
            );
          });

          it('should dispatch update events', () => {
            expect(submitCallback).toHaveBeenCalledTimes(1);
          });

          it('should not report validation', () => {
            expect(getInput().reportValidity).not.toHaveBeenCalled();
          });
        });
      });

      describe('when the input is invalid', () => {
        beforeEach(async () => {
          element = await fixture(
            html`<oryx-cart-quantity-input
              min="5"
              value="2"
              @update=${updateCallback}
              @submit=${submitCallback}
            >
            </oryx-cart-quantity-input>`
          );

          vi.spyOn(getInput(), 'reportValidity');
        });

        describe('and the Enter keydown is dispatched', () => {
          beforeEach(() => {
            getInput().dispatchEvent(
              new KeyboardEvent('keydown', {
                key: 'Enter',
                bubbles: true,
              })
            );
          });

          it('should not dispatch update events', () => {
            expect(submitCallback).not.toHaveBeenCalled();
          });

          it('should report validation', () => {
            expect(getInput().reportValidity).toHaveBeenCalled();
          });
        });
      });
    });

    describe('when submitOnChange is not true', () => {
      describe('and the increase/decrease buttons are clicked and change event is applied', () => {
        beforeEach(() => {
          increaseButton.click();
          decreaseButton.click();
          getInput().dispatchEvent(new Event('change', { bubbles: true }));
        });

        it('should dispatch update events', () => {
          expect(updateCallback).toHaveBeenCalledTimes(3);
        });

        it('should not dispatch submit events', () => {
          expect(submitCallback).not.toHaveBeenCalled();
        });
      });
    });

    describe('when submitOnChange is true', () => {
      beforeEach(() => {
        element.submitOnChange = true;
      });

      describe('and the increase/decrease buttons are clicked and change event is applied', () => {
        beforeEach(() => {
          increaseButton.click();
          decreaseButton.click();
          getInput().dispatchEvent(new Event('change', { bubbles: true }));
        });

        it('should dispatch submit events', () => {
          expect(submitCallback).toHaveBeenCalledTimes(3);
        });

        it('should not dispatch update events', () => {
          expect(updateCallback).not.toHaveBeenCalled();
        });
      });

      describe('and an invalid quantity is added', () => {
        beforeEach(async () => {
          getInput().max = '10';
          getInput().value = '11';
          getInput().dispatchEvent(new Event('change', { bubbles: true }));
        });

        it('should not dispatch submit events', () => {
          expect(submitCallback).not.toHaveBeenCalledTimes(3);
        });

        it('should dispatch update events', () => {
          expect(updateCallback).toHaveBeenCalled();
        });
      });
    });
  });

  describe('step', () => {
    describe('when the step is not provided', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-cart-quantity-input></oryx-cart-quantity-input>`
        );
      });

      it('should have a default step value of 1', () => {
        expect(element).toContainElement(`input[step='1']`);
      });
    });

    describe('when the step is set to 0.1', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-cart-quantity-input step="0.1"></oryx-cart-quantity-input>`
        );
      });

      it('should have a step of 0.1', () => {
        expect(element).toContainElement(`input[step='0.1']`);
      });

      describe('and value is not match the step', () => {
        beforeEach(async () => {
          element = await fixture(
            html`<oryx-cart-quantity-input
              step="0.1"
              value="0.01"
            ></oryx-cart-quantity-input>`
          );
        });

        it('should set "hasError" attribute on oryx-input', () => {
          expect(element).toContainElement(`oryx-input[hasError]`);
        });
      });
    });
  });

  describe('min', () => {
    describe('when min is not provided', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-cart-quantity-input></oryx-cart-quantity-input>`
        );
      });

      it('should not exist "hasError" attribute on oryx-input', () => {
        expect(element).not.toContainElement(`oryx-input[hasError]`);
      });

      it('should set "1" as default minimum', () => {
        expect(element).toContainElement(`input[min='1']`);
      });
    });

    describe('when "min" property is set to a value', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-cart-quantity-input min="4"></oryx-cart-quantity-input>`
        );
      });

      it('should not exist "hasError" attribute on oryx-input', () => {
        expect(element).not.toContainElement(`oryx-input[hasError]`);
      });

      it('should provide the min value to the input', () => {
        expect(element).toContainElement(`input[min='4']`);
      });

      describe('and the value is greater then the minimum', () => {
        beforeEach(async () => {
          element = await fixture(
            html`<oryx-cart-quantity-input
              min="4"
              value="8"
            ></oryx-cart-quantity-input>`
          );
        });

        it('should not exist "hasError" attribute on oryx-input', () => {
          expect(element).not.toContainElement(`oryx-input[hasError]`);
        });

        it('should not disable the "decrease" button', () => {
          expect(element).toContainElement(
            `button[part='decrease']:not([disabled])`
          );
        });

        describe('and "decrease" button is clicked', () => {
          beforeEach(async () => {
            const button = element.renderRoot.querySelector(
              `button[part='decrease']`
            ) as HTMLButtonElement;
            button.click();
          });

          it('should decrease the value', () => {
            expect(getInput().value).toBe('7');
          });
        });
      });

      describe('and the value equals the minimum', () => {
        beforeEach(async () => {
          element = await fixture(
            html`<oryx-cart-quantity-input
              min="4"
              value="4"
            ></oryx-cart-quantity-input>`
          );
        });

        it('should not exist "hasError" attribute on oryx-input', () => {
          expect(element).not.toContainElement(`oryx-input[hasError]`);
        });

        it('should disable the "decrease" button', () => {
          expect(element).toContainElement(`button[part='decrease'][disabled]`);
        });
      });

      describe('and the value is smaller than the minimum', () => {
        beforeEach(async () => {
          element = await fixture(
            html`<oryx-cart-quantity-input
              min="4"
              value="1"
            ></oryx-cart-quantity-input>`
          );
        });

        it('should set the "hasError" attribute to oryx-input', () => {
          expect(element).toContainElement(`oryx-input[hasError]`);
        });

        describe('and "increase" button is clicked', () => {
          beforeEach(() => {
            const button = element.renderRoot.querySelector(
              `button[part='increase']`
            ) as HTMLButtonElement;
            button.click();
          });

          it('should set the value to minimum', () => {
            expect(getInput().value).toBe('4');
          });

          it('should not exist "hasError" attribute on oryx-input', () => {
            expect(element).not.toContainElement(`oryx-input[hasError]`);
          });
        });
      });
    });
  });

  describe('value', () => {
    describe('when a value is given', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-cart-quantity-input value="3"></oryx-cart-quantity-input>`
        );
      });

      it('should use the value to set the default value', () => {
        expect(getInput().value).toBe('3');
      });

      it('should not exist "hasError" attribute on oryx-input', () => {
        expect(element).not.toContainElement(`oryx-input[hasError]`);
      });
    });

    describe('when no value is given', () => {
      it('should not exist "hasError" attribute on oryx-input', () => {
        expect(element).not.toContainElement(`oryx-input[hasError]`);
      });

      describe('and no min value is given', () => {
        beforeEach(async () => {
          element = await fixture(
            html`<oryx-cart-quantity-input></oryx-cart-quantity-input>`
          );
        });

        it('should have a default value of 1', () => {
          expect(getInput().value).toBe('1');
        });

        it('should not exist "hasError" attribute on oryx-input', () => {
          expect(element).not.toContainElement(`oryx-input[hasError]`);
        });
      });

      describe('and a min value is given', () => {
        beforeEach(async () => {
          element = await fixture(
            html`<oryx-cart-quantity-input min="5"></oryx-cart-quantity-input>`
          );
        });

        it('should use the min value as the default value', () => {
          expect(getInput().value).toBe('5');
        });

        it('should not exist "hasError" attribute on oryx-input', () => {
          expect(element).not.toContainElement(`oryx-input[hasError]`);
        });
      });
    });

    describe('when value is between min and max', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-cart-quantity-input
            min="1"
            value="5"
            max="10"
          ></oryx-cart-quantity-input>`
        );
      });

      it('should pass validation', () => {
        expect(getInput().validity.valid).toBe(true);
      });

      it('should not exist "hasError" attribute on oryx-input', () => {
        expect(element).not.toContainElement(`oryx-input[hasError]`);
      });

      it('should have an enabled "decrease" button', () => {
        expect(element).toContainElement(
          `button[part='decrease']:not([disabled])`
        );
      });

      it('should have an enabled "increase" button', () => {
        expect(element).toContainElement(
          `button[part='increase']:not([disabled])`
        );
      });

      describe('and the "decrease" button is clicked', () => {
        beforeEach(() => {
          const button = element.renderRoot.querySelector(
            `button[part='decrease']`
          ) as HTMLButtonElement;
          button.click();
        });

        it('should decrease the input value by 1', () => {
          expect(getInput().value).toBe('4');
        });
      });

      describe('and the "increase" button is clicked', () => {
        beforeEach(() => {
          const button = element.renderRoot.querySelector(
            `button[part='increase']`
          ) as HTMLButtonElement;
          button.click();
        });

        it('should increase the input value by 1', () => {
          expect(getInput().value).toBe('6');
        });
      });

      describe('and the property "value" changes', () => {
        it('should update the input value', async () => {
          element.value = 2;
          element.requestUpdate();
          await element.updateComplete;
          expect(getInput().value).toBe('2');
        });
      });
    });
  });

  describe('max', () => {
    describe('when max is not provided', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-cart-quantity-input></oryx-cart-quantity-input>`
        );
      });

      it('should not set a max value', () => {
        expect(element).toContainElement(`input:not([max])`);
      });
    });

    describe('when "max" property is set to a value', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-cart-quantity-input max="4"></oryx-cart-quantity-input>`
        );
      });

      it('should not exist "hasError" attribute on oryx-input', () => {
        expect(element).not.toContainElement(`oryx-input[hasError]`);
      });

      it('should provide it to input', () => {
        expect(element).toContainElement(`input[max='4']`);
      });

      describe('and the value is smaller then the maximum', () => {
        beforeEach(async () => {
          element = await fixture(
            html`<oryx-cart-quantity-input
              max="4"
              value="1"
            ></oryx-cart-quantity-input>`
          );
        });

        it('should not exist "hasError" attribute on oryx-input', () => {
          expect(element).not.toContainElement(`oryx-input[hasError]`);
        });

        it('should not disable the "increase" button', () => {
          expect(element).toContainElement(
            `button[part='increase']:not([disabled])`
          );
        });

        describe('and "increase" button is clicked', () => {
          beforeEach(async () => {
            const button = element.renderRoot.querySelector(
              `button[part='increase']`
            ) as HTMLButtonElement;
            button.click();
          });

          it('should increase the value ', () => {
            expect(getInput().value).toBe('2');
          });

          it('should not exist "hasError" attribute on oryx-input', () => {
            expect(element).not.toContainElement(`oryx-input[hasError]`);
          });
        });
      });

      describe('and the value equals the maximum', () => {
        beforeEach(async () => {
          element = await fixture(
            html`<oryx-cart-quantity-input
              max="4"
              value="4"
            ></oryx-cart-quantity-input>`
          );
        });

        it('should not exist "hasError" attribute on oryx-input', () => {
          expect(element).not.toContainElement(`oryx-input[hasError]`);
        });

        it('should disable the "increase" button', () => {
          expect(element).toContainElement(`button[part='increase'][disabled]`);
        });
      });

      describe('and the value is larger than the maximum', () => {
        beforeEach(async () => {
          getInput().value = '7';
          getInput().dispatchEvent(new InputEvent('input', { bubbles: true }));
        });

        it('should set "hasError" attribute on oryx-input', () => {
          expect(element).toContainElement(`oryx-input[hasError]`);
        });

        describe('and "decrease" button is clicked', () => {
          beforeEach(() => {
            const button = element.renderRoot.querySelector(
              `button[part='decrease']`
            ) as HTMLButtonElement;
            button.click();
          });

          it('should set the value to maximum', () => {
            expect(getInput().value).toBe('4');
          });

          it('should not exist "hasError" attribute on oryx-input', () => {
            expect(element).not.toContainElement(`oryx-input[hasError]`);
          });
        });
      });
    });
  });

  describe('validate input', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-cart-quantity-input></oryx-cart-quantity-input>`
      );
      vi.spyOn(getInput(), 'reportValidity');
    });

    describe('when the input event is dispatched', () => {
      beforeEach(() => {
        getInput().dispatchEvent(new InputEvent('input', { bubbles: true }));
      });

      it('should report validity', () => {
        expect(getInput().reportValidity).toHaveBeenCalled();
      });
    });

    describe('when the focus event is dispatched', () => {
      beforeEach(() => {
        getInput().dispatchEvent(new FocusEvent('focus', { bubbles: true }));
      });

      it('should report validity', () => {
        expect(getInput().reportValidity).toHaveBeenCalled();
      });
    });
  });

  describe('when the disabled attribute is set', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-cart-quantity-input disabled></oryx-cart-quantity-input>`
      );
    });

    it('should disable the "decrease" button', () => {
      expect(element).toContainElement(`button[part='decrease'][disabled]`);
    });

    it('should disable the input element', () => {
      expect(element).toContainElement('input[disabled');
    });

    it('should disable the "increase" button', () => {
      expect(element).toContainElement(`button[part='increase'][disabled]`);
    });
  });

  describe('when the value changes to invalid', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-cart-quantity-input
          max="3"
          value="2"
        ></oryx-cart-quantity-input>`
      );
      getInput().value = '4';
      getInput().dispatchEvent(new InputEvent('input', { bubbles: true }));
    });

    it('should set "hasError" attribute on oryx-input', () => {
      expect(element).toContainElement(`oryx-input[hasError]`);
    });
  });

  describe('icons', () => {
    describe('when the decrease icon is not specified', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-cart-quantity-input></oryx-cart-quantity-input>`
        );
      });

      it('should default to "decrease" type', () => {
        expect(element).toContainElement(
          `button[part="decrease"] oryx-icon[type="${IconTypes.Decrease}"]`
        );
      });
    });

    describe('when the decrease icon is specified', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-cart-quantity-input
            .decreaseIcon=${'decreaseIconType'}
          ></oryx-cart-quantity-input>`
        );
      });

      it('should render the icon with the given type', () => {
        expect(element).toContainElement(
          'button[part="decrease"] oryx-icon[type="decreaseIconType"]'
        );
      });
    });

    describe('when the increase icon is not specified', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-cart-quantity-input></oryx-cart-quantity-input>`
        );
      });

      it('should default to "increase" type', () => {
        expect(element).toContainElement(
          `button[part="increase"] oryx-icon[type="${IconTypes.Increase}"]`
        );
      });
    });

    describe('when the increase icon is specified', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-cart-quantity-input
            .increaseIcon=${'increaseIconType'}
          ></oryx-cart-quantity-input>`
        );
      });

      it('should render the icon with the given type', () => {
        expect(element).toContainElement(
          'button[part="increase"] oryx-icon[type="increaseIconType"]'
        );
      });
    });
  });

  describe('when label is provided', () => {
    const label = 'TestLabel';

    beforeEach(async () => {
      element = await fixture(
        html`<oryx-cart-quantity-input
          value=${1}
          label=${label}
        ></oryx-cart-quantity-input>`
      );
    });

    it('should pass the label to the oryx-input', () => {
      expect(
        element.renderRoot.querySelector('oryx-input')?.getAttribute('label')
      ).toBe(label);
    });
  });
});
