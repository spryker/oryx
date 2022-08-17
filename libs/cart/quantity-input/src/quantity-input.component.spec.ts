import { fixture } from '@open-wc/testing-helpers';
import { useComponent } from '@spryker-oryx/core/utilities';
import '@spryker-oryx/testing';
import { html } from 'lit';
import { quantityInputComponent } from './component';
import { QuantityInputComponent } from './quantity-input.component';

describe('Quantity input', () => {
  let element: QuantityInputComponent;
  const getInput = (): HTMLInputElement => {
    return element.renderRoot.querySelector('input') as HTMLInputElement;
  };

  beforeAll(async () => {
    await useComponent(quantityInputComponent);
  });

  describe('when "min" property is provided', () => {
    const min = 4;
    beforeEach(async () => {
      element = await fixture(
        html`<quantity-input min=${min}></quantity-input>`
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
        html`<quantity-input max=${max}></quantity-input>`
      );
    });

    it('should provide it to input', () => {
      expect(getInput().getAttribute('max')).toBe(max.toString());
    });
  });

  describe('when no properties are provided', () => {
    beforeEach(async () => {
      element = await fixture(html`<quantity-input></quantity-input>`);
    });

    it('should set "1" as default minimum', () => {
      expect(getInput().getAttribute('min')).toBe('1');
    });
  });

  describe('when value equals to minimum', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<quantity-input value="2" min="2"></quantity-input>`
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
        html`<quantity-input value="2" max="2"></quantity-input>`
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
        html`<quantity-input
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
        html`<quantity-input value=${value} min=${min}></quantity-input>`
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
        html`<quantity-input value=${value} max=${max}></quantity-input>`
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
      element = await fixture(html`<quantity-input disabled></quantity-input>`);
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
});
