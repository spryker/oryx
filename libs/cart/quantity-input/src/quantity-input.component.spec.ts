import { fixture } from '@open-wc/testing-helpers';
import { useComponent } from '@spryker-oryx/core/utilities';
import { html } from 'lit';
import { quantityInputComponent } from './component';
import { QuantityInputComponent } from './quantity-input.component';

describe('Quantity input', () => {
  let element: QuantityInputComponent;
  const getInput = (): HTMLInputElement => {
    return element.renderRoot.querySelector('input') as HTMLInputElement;
  };
  const dispatchChangeEvent = (): void => {
    getInput().dispatchEvent(new Event('change'));
  };

  beforeAll(async () => {
    await useComponent(quantityInputComponent);
  });

  describe('when "min" property is provided', () => {
    const min = 4;
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-cart-quantity-input min=${min}></quantity-input>`
      );
    });

    it('should provide it to input', () => {
      expect(getInput().getAttribute('min')).toBe(min.toString());
    });
  });

  describe('when "max" property is provided', () => {
    const max = 4;
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-cart-quantity-input max=${max}></quantity-input>`
      );
    });

    it('should provide it to input', () => {
      expect(getInput().getAttribute('max')).toBe(max.toString());
    });
  });

  describe('when no properties are provided', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-cart-quantity-input></quantity-input>`
      );
    });

    it('should set "1" as default minimum', () => {
      expect(getInput().getAttribute('min')).toBe('1');
    });
  });

  describe('when value equals to minimum', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-cart-quantity-input value="2" min="2"></quantity-input>`
      );
    });

    it('should pass validation', () => {
      expect(element.validate()).toBe(true);
    });

    it('should render "decrease" button with "disabled" attribute', () => {
      const decreaseButton = element.renderRoot.querySelector(
        'button[aria-label="decrease"]'
      ) as HTMLButtonElement;
      expect(decreaseButton.hasAttribute('disabled')).toBe(true);
    });
  });

  describe('when value equals to maximum', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-cart-quantity-input value="2" max="2"></quantity-input>`
      );
    });

    it('should pass validation', () => {
      expect(element.validate()).toBe(true);
    });

    it('should render "increase" button with "disabled" attribute', () => {
      const decreaseButton = element.renderRoot.querySelector(
        'button[aria-label="increase"]'
      ) as HTMLButtonElement;
      expect(decreaseButton.hasAttribute('disabled')).toBe(true);
    });
  });

  describe('when value is between minimum and maximum number', () => {
    const value = 5;
    const min = 2;
    const max = 10;

    beforeEach(async () => {
      element = await fixture(
        html`<oryx-cart-quantity-input
          value=${value}
          min=${min}
          max=${max}
        ></quantity-input>`
      );
    });

    it('should pass validation', () => {
      expect(element.validate()).toBe(true);
    });

    it('should render "decrease" button without "disabled" attribute', () => {
      const decreaseButton = element.renderRoot.querySelector(
        'button[aria-label="decrease"]'
      ) as HTMLButtonElement;
      expect(decreaseButton.hasAttribute('disabled')).toBe(false);
    });

    describe('and "decrease" button is clicked', () => {
      beforeEach(() => {
        const button = element.renderRoot.querySelector(
          'button[aria-label="decrease"]'
        ) as HTMLButtonElement;
        button.click();
      });

      it('should decrease the input value by 1', () => {
        expect(getInput().value).toBe((value - 1).toString());
      });
    });

    describe('and "increase" button is clicked', () => {
      beforeEach(() => {
        const button = element.renderRoot.querySelector(
          'button[aria-label="increase"]'
        ) as HTMLButtonElement;
        button.click();
      });

      it('should increase the input value by 1', () => {
        expect(getInput().value).toBe((value + 1).toString());
      });
    });
  });

  describe('when value is less than minimum number', () => {
    const value = 2;
    const min = 5;

    beforeEach(async () => {
      element = await fixture(
        html`<oryx-cart-quantity-input value=${value} min=${min}></quantity-input>`
      );
    });

    it('should not pass validation', () => {
      expect(element.validate()).toBe(false);
    });

    it('should render "decrease" button with "disabled" attribute', () => {
      const decreaseButton = element.renderRoot.querySelector(
        'button[aria-label="decrease"]'
      ) as HTMLButtonElement;
      expect(decreaseButton.hasAttribute('disabled')).toBe(true);
    });

    describe('and "increase" button is clicked', () => {
      beforeEach(() => {
        const button = element.renderRoot.querySelector(
          'button[aria-label="increase"]'
        ) as HTMLButtonElement;
        button.click();
      });

      it('should set the value to minimum', () => {
        expect(getInput().value).toBe(min.toString());
      });
    });
  });

  describe('when value is greater than maximum number', () => {
    const value = 5;
    const max = 2;

    beforeEach(async () => {
      element = await fixture(
        html`<oryx-cart-quantity-input value=${value} max=${max}></quantity-input>`
      );
    });

    it('should not pass validation', () => {
      expect(element.validate()).toBe(false);
    });

    it('should render "increase" button with "disabled" attribute', () => {
      const decreaseButton = element.renderRoot.querySelector(
        'button[aria-label="increase"]'
      ) as HTMLButtonElement;
      expect(decreaseButton.hasAttribute('disabled')).toBe(true);
    });

    describe('and "decrease" button is clicked', () => {
      beforeEach(() => {
        const button = element.renderRoot.querySelector(
          'button[aria-label="decrease"]'
        ) as HTMLButtonElement;
        button.click();
      });

      it('should set the value to minimum', () => {
        expect(getInput().value).toBe(max.toString());
      });
    });
  });

  describe('when "disabled" property is passed', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-cart-quantity-input disabled></quantity-input>`
      );
    });

    it('should render "decrease" button with "disabled" attribute', () => {
      const decreaseButton = element.renderRoot.querySelector(
        'button[aria-label="decrease"]'
      ) as HTMLButtonElement;
      expect(decreaseButton.hasAttribute('disabled')).toBe(true);
    });

    it('should render "increase" button with "disabled" attribute', () => {
      const decreaseButton = element.renderRoot.querySelector(
        'button[aria-label="increase"]'
      ) as HTMLButtonElement;
      expect(decreaseButton.hasAttribute('disabled')).toBe(true);
    });

    it('should render the input with "disabled" attribute', () => {
      expect(getInput().hasAttribute('disabled')).toBe(true);
    });
  });

  describe('when property "value" is changed', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-cart-quantity-input value=${1}></quantity-input>`
      );
    });

    it('should update input`s value', async () => {
      expect(getInput().value).toBe('1');

      element.value = 2;
      element.requestUpdate();
      await element.updateComplete;

      expect(getInput().value).toBe('2');
    });
  });

  describe('when label is provided', () => {
    const label = 'label';

    beforeEach(async () => {
      element = await fixture(
        html`<oryx-cart-quantity-input value=${1} label=${label}></quantity-input>`
      );
    });

    it('should pass the label to the oryx-input', async () => {
      expect(
        element.renderRoot.querySelector('oryx-input')?.getAttribute('label')
      ).toBe(label);
    });
  });

  describe('when incorrect input value is set', () => {
    const callback = vi.fn();

    beforeEach(async () => {
      element = await fixture(
        html` <oryx-cart-quantity-input
          min=${1}
          value=${2}
          max=${3}
          @oryx.update=${callback}
        ></quantity-input>`
      );
    });

    describe('and value is less then min', () => {
      beforeEach(() => {
        getInput().value = '0';
        dispatchChangeEvent();
      });

      it('should not dispatch the quantity event and set value to the last', () => {
        expect(callback).not.toHaveBeenCalled();
        expect(getInput().value).toBe('2');
      });
    });

    describe('and value is greater then max', () => {
      beforeEach(() => {
        getInput().value = '4';
        dispatchChangeEvent();
      });

      it('should not dispatch the quantity event and set value to the last', () => {
        expect(callback).not.toHaveBeenCalled();
        expect(getInput().value).toBe('2');
      });
    });

    describe('and input`s value equals to the property`s value', () => {
      beforeEach(() => {
        getInput().value = '2';
        dispatchChangeEvent();
      });

      it('should not dispatch the quantity event', () => {
        expect(callback).not.toHaveBeenCalled();
      });
    });
  });

  describe('when custom icons are provided', () => {
    const customIcon = 'close';

    beforeEach(async () => {
      element = await fixture(
        html` <oryx-cart-quantity-input
          decrease-icon=${customIcon}
          increase-icon=${customIcon}
        ></quantity-input>`
      );
    });

    it('should override the default icon for decrease button', () => {
      const icon = element.renderRoot.querySelector(
        'button[aria-label="decrease"] oryx-icon'
      );
      expect(icon?.getAttribute('type')).toBe(customIcon);
    });

    it('should override the default icon for increase button', () => {
      const icon = element.renderRoot.querySelector(
        'button[aria-label="increase"] oryx-icon'
      );
      expect(icon?.getAttribute('type')).toBe(customIcon);
    });
  });
});
