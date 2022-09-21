import { elementUpdated, fixture } from '@open-wc/testing-helpers';
import {
  QuantityInputComponent,
  quantityInputComponent,
} from '@spryker-oryx/cart/quantity-input';
import { useComponent } from '@spryker-oryx/core/utilities';
import { createInjector, destroyInjector } from '@spryker-oryx/injector';
import { siteProviders } from '@spryker-oryx/site';
import '@spryker-oryx/testing';
import { html } from 'lit';
import { RemoveByQuantity } from '../../entry.model';
import { CartEntryPriceComponent } from '../price/price.component';
import { cartEntryContentComponent } from './component';
import { CartEntryContentComponent } from './content.component';

describe('CartEntryContentComponent', () => {
  let element: CartEntryContentComponent;
  const options = {
    quantity: 2,
    calculations: { unitPrice: 1000, sumPrice: 2000 },
  };

  const getQuantityInputComponent = (): QuantityInputComponent => {
    return element.renderRoot.querySelector(
      'quantity-input'
    ) as QuantityInputComponent;
  };

  beforeAll(async () => {
    await useComponent([cartEntryContentComponent, quantityInputComponent]);
  });

  beforeEach(async () => {
    createInjector({
      providers: siteProviders,
    });
    element = await fixture(html`<cart-entry-content
      .options=${options}
    ></cart-entry-content>`);
  });

  afterEach(() => {
    destroyInjector();
  });

  describe('content', () => {
    describe('prices', () => {
      it('should render unitPrice', () => {
        const unitPrice = element.renderRoot.querySelector(
          '.col:first-child cart-entry-price'
        ) as CartEntryPriceComponent;
        expect(unitPrice?.price).toBe(options.calculations.unitPrice);
      });

      it('should render sumPrice', () => {
        const sumPrice = element.renderRoot.querySelector(
          '.col:last-child cart-entry-price'
        ) as CartEntryPriceComponent;
        expect(sumPrice?.price).toBe(options.calculations.sumPrice);
      });
    });

    describe('quantity control', () => {
      it('should not be disabled', () => {
        expect(getQuantityInputComponent()?.disabled).toBe(false);
      });

      it('should have correct value', () => {
        expect(getQuantityInputComponent()?.value).toBe(options.quantity);
      });
    });
  });

  describe('when component is disabled', () => {
    beforeEach(async () => {
      element = await fixture(html`<cart-entry-content
        disabled
        .options=${{ ...options }}
      ></cart-entry-content>`);
    });
    it('should disable the input', () => {
      expect(getQuantityInputComponent()?.disabled).toBe(true);
    });
  });

  describe('when quantity is changed', () => {
    beforeEach(async () => {
      element = await fixture(html`<cart-entry-content
        .options=${{ ...options }}
      ></cart-entry-content>`);

      (getQuantityInputComponent() as QuantityInputComponent).value = 4;
    });
    it('should update quantity input`s value', async () => {
      element.requestUpdate();
      await elementUpdated(element);

      expect(getQuantityInputComponent()?.value).toBe(options.quantity);
    });
  });

  describe('when removeByQuantity is provided', () => {
    beforeEach(async () => {
      element = await fixture(html`<cart-entry-content
        .options=${{
          ...options,
          quantity: 1,
          removeByQuantity: RemoveByQuantity.ShowBin,
        }}
      ></cart-entry-content>`);
    });
    it('should set min value to 0', async () => {
      expect(getQuantityInputComponent()?.min).toBe(0);
    });
    it('should set "decrease-icon" attribute', async () => {
      expect(getQuantityInputComponent()?.hasAttribute('decrease-icon')).toBe(
        true
      );
    });
  });
});
