import { fixture } from '@open-wc/testing-helpers';
import '@spryker-oryx/testing';
import { ButtonComponent } from '@spryker-oryx/ui/button';
import { html } from 'lit';
import { beforeEach, describe, expect } from 'vitest';
import '../index';
import { AddToCartComponent } from './add-to-cart.component';

describe('Add to cart', () => {
  let element: AddToCartComponent;
  const inputEvent = new Event('input');

  const checkFormValidity = (shouldBeValid: boolean): void => {
    it(`should ${shouldBeValid ? '' : 'not'}pass validation`, () => {
      const form = element.renderRoot.querySelector('form') as HTMLFormElement;
      expect(form.checkValidity()).toBe(shouldBeValid);
    });
  };

  describe('when "hideQuantityInput" prop is provided', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<add-to-cart
          .content=${{ hideQuantityInput: true }}
        ></add-to-cart>`
      );
    });

    checkFormValidity(true);

    it('should not render quantity input', () => {
      const input = element.renderRoot.querySelector(
        'input[type="number"]'
      ) as HTMLInputElement;

      expect(input).toBeNull();
    });

    it('should not render quantity increase and decrease buttons', () => {
      const buttons = element.renderRoot.querySelectorAll(
        'button'
      ) as NodeListOf<HTMLInputElement>;

      expect(buttons.length).toBe(1);
    });
  });

  describe('when "hideQuantityInput" prop is not provided', () => {
    beforeEach(async () => {
      element = await fixture(html`<add-to-cart></add-to-cart>`);
    });

    checkFormValidity(true);

    it('should render quantity input', () => {
      const input = element.renderRoot.querySelector(
        'input[type="number"]'
      ) as HTMLInputElement;

      expect(input).not.toBeNull();
    });

    it('should render quantity increase and decrease button', () => {
      const buttons = element.renderRoot.querySelectorAll(
        'button'
      ) as NodeListOf<HTMLInputElement>;

      expect(buttons.length).toBe(3);
    });

    it('should render "1" as default value in input', () => {
      const input = element.renderRoot.querySelector(
        'input[type="number"]'
      ) as HTMLInputElement;
      expect(input.value).toBe('1');
    });

    it('should render "decrease" button with "disabled" attribute', () => {
      const button = element.renderRoot.querySelector(
        'button'
      ) as HTMLButtonElement;

      expect(button.hasAttribute('disabled')).toBe(true);
    });

    describe('and input value is "2"', () => {
      let input: HTMLInputElement;

      beforeEach(async () => {
        input = element.renderRoot.querySelector(
          'input[type="number"]'
        ) as HTMLInputElement;
        input.value = '2';
        input.dispatchEvent(inputEvent);
      });

      describe('then "decrease" button is clicked', () => {
        beforeEach(() => {
          const decreaseButton = element.renderRoot.querySelector(
            'button'
          ) as HTMLInputElement;
          decreaseButton.click();
        });
        checkFormValidity(true);

        it('should set "1" value in the input', () => {
          expect(input.value).toBe('1');
        });
      });

      it('render "decrease" button without "disabled" attribute', () => {
        const button = element.renderRoot.querySelector(
          'button'
        ) as HTMLButtonElement;

        expect(button.hasAttribute('disabled')).toBe(false);
      });
    });

    describe('and "increase" button is clicked', () => {
      beforeEach(async () => {
        const buttons = element.renderRoot.querySelectorAll(
          'button'
        ) as NodeListOf<HTMLInputElement>;
        buttons[1].click();
      });

      checkFormValidity(true);

      it('should set "2" value in the input', () => {
        const input = element.renderRoot.querySelector(
          'input[type="number"]'
        ) as HTMLInputElement;
        expect(input.value).toBe('2');
      });
    });

    describe('and "decrease" button is clicked', () => {
      beforeEach(async () => {
        const decreaseButton = element.renderRoot.querySelector(
          'button'
        ) as HTMLInputElement;
        decreaseButton.click();
      });

      checkFormValidity(true);

      it('should set "1" value in the input', () => {
        const input = element.renderRoot.querySelector(
          'input[type="number"]'
        ) as HTMLInputElement;
        expect(input.value).toBe('1');
      });
    });

    describe('and negative number is provided in input', () => {
      beforeEach(async () => {
        const input = element.renderRoot.querySelector(
          'input[type="number"]'
        ) as HTMLInputElement;
        input.value = '-1';
        input.dispatchEvent(inputEvent);
      });

      checkFormValidity(false);
    });

    describe('and float number is provided in input', () => {
      beforeEach(async () => {
        const input = element.renderRoot.querySelector(
          'input[type="number"]'
        ) as HTMLInputElement;
        input.value = '1.19';

        input.dispatchEvent(inputEvent);
      });

      checkFormValidity(false);
    });
  });

  describe('when "loading" prop is provided', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<add-to-cart .content=${{ loading: true }}></add-to-cart>`
      );
    });

    it('should render the submit button with "loading" attribute', () => {
      const buttons = element.renderRoot.querySelectorAll(
        'oryx-button'
      ) as NodeListOf<ButtonComponent>;
      expect(buttons[2].hasAttribute('loading')).toBe(true);
    });

    it('should render "decrease" button with "disabled" attribute', () => {
      const button = element.renderRoot.querySelector(
        'button'
      ) as HTMLButtonElement;
      expect(button.hasAttribute('disabled'));
    });

    it('should render "increase" button with "disabled" attribute', () => {
      const buttons = element.renderRoot.querySelectorAll(
        'button'
      ) as NodeListOf<HTMLButtonElement>;
      expect(buttons[1].hasAttribute('disabled'));
    });

    it('should render input with "disabled" attribute', () => {
      const input = element.renderRoot.querySelector(
        'input[type="number"]'
      ) as HTMLInputElement;
      expect(input.hasAttribute('disabled'));
    });
  });
});
