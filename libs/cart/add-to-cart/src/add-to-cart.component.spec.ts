import { fixture } from '@open-wc/testing-helpers';
import '@spryker-oryx/testing';
import { ButtonComponent } from '@spryker-oryx/ui/button';
import { html } from 'lit';
import { QuantityInputComponent } from '../../quantity-input';
import '../index';
import { AddToCartComponent } from './add-to-cart.component';

describe('Add to cart', () => {
  let element: AddToCartComponent;

  describe('when "hideQuantityInput" prop is true', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<add-to-cart
          .options=${{ hideQuantityInput: true }}
        ></add-to-cart>`
      );
    });

    it('should not render quantity controls', () => {
      const quantityControls = element.renderRoot.querySelector(
        'quantity-input'
      ) as QuantityInputComponent;

      expect(quantityControls).toBeNull();
    });
  });

  describe('when "hideQuantityInput" prop is false', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<add-to-cart
          .options=${{ hideQuantityInput: false }}
        ></add-to-cart>`
      );
    });

    it('should render quantity controls', () => {
      const quantityControls = element.renderRoot.querySelector(
        'oryx-button'
      ) as HTMLElement;

      expect(quantityControls).not.toBeNull();
    });
  });

  describe('when "loading" prop is provided', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<add-to-cart .options=${{ loading: true }}></add-to-cart>`
      );
    });

    it('should render the submit button with "loading" attribute', () => {
      const button = element.renderRoot.querySelector(
        'oryx-button'
      ) as ButtonComponent;

      expect(button.hasAttribute('loading')).toBe(true);
    });
  });
});
