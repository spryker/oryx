import { fixture } from '@open-wc/testing-helpers';
import { QuantityInputComponent } from '@spryker-oryx/cart/quantity-input';
import { useComponent } from '@spryker-oryx/core/utilities';
import { destroyInjector } from '@spryker-oryx/di';
import {
  ItemsFilters,
  PickingListItem,
  pickingProductCardComponent,
} from '@spryker-oryx/picking';
import { ImageComponent } from '@spryker-oryx/ui/image';
import { html } from 'lit';
import { mockPickingListData } from '../../mocks';
import { PickingProductCardComponent } from './picking-product-card.component';

describe.only('PickingProductCardComponent', () => {
  let element: PickingProductCardComponent;
  const productItem: PickingListItem = mockPickingListData[0].items[0];

  beforeAll(async () => {
    await useComponent(pickingProductCardComponent);
  });

  afterEach(() => {
    vi.clearAllMocks();
    destroyInjector();
  });

  describe('when a product provided with status NotPicked', () => {
    beforeEach(async () => {
      element = await fixture(
        html`
          <oryx-picking-product-card
            .productItem="${productItem}"
            status="${ItemsFilters.NotPicked}"
          ></oryx-picking-product-card>
        `
      );
    });

    it('passes the a11y audit', async () => {
      await expect(element).shadowDom.to.be.accessible();
    });

    it('should render name and sku', () => {
      expect(
        element.renderRoot
          .querySelector("[slot='heading']")
          ?.textContent?.trim()
      ).toBe(productItem.orderItem.name);

      expect(element.renderRoot.querySelector('h4')?.textContent?.trim()).toBe(
        productItem.orderItem.sku
      );
    });

    it('should not render oryx-image with the image-fade class', () => {
      expect(
        element.renderRoot
          .querySelector('oryx-image')
          ?.classList.value.includes('image-fade')
      ).toBe(false);

      expect(
        (element.shadowRoot?.querySelector('oryx-image') as ImageComponent).src
      ).toBe(productItem.product.image);
    });

    it('should render quantity input', () => {
      expect(
        (
          element.shadowRoot?.querySelector(
            'oryx-cart-quantity-input'
          ) as QuantityInputComponent
        ).max
      ).toBe(productItem.quantity);

      expect(
        (
          element.shadowRoot?.querySelector(
            'oryx-cart-quantity-input'
          ) as QuantityInputComponent
        ).value
      ).toBe(productItem.numberOfPicked);
    });

    describe('when the quantity is enabled', () => {
      it('should enable the button', () => {
        expect(
          element.shadowRoot
            ?.querySelector('oryx-button button')
            ?.hasAttribute('disabled')
        ).toBe(false);
      });

      describe('and when an update is dispatched with an invalid quantity', () => {
        beforeEach(() => {
          const input = element.shadowRoot?.querySelector(
            'oryx-cart-quantity-input'
          );
          input?.dispatchEvent(
            new CustomEvent<unknown>('update', {
              detail: { quantity: 30 },
            })
          );
        });

        it('should disable the button', () => {
          expect(
            element.shadowRoot
              ?.querySelector('oryx-button button')
              ?.hasAttribute('disabled')
          ).toBe(true);
        });
      });
    });

    describe('when user submit a quantity', () => {
      const spy = vi.fn();

      beforeEach(async () => {
        const el = await fixture(
          html`
            <oryx-picking-product-card
              .productItem="${productItem}"
              status="${ItemsFilters.NotPicked}"
            ></oryx-picking-product-card>
          `
        );

        el.addEventListener('oryx.submit', spy);

        const button = el.shadowRoot?.querySelector(
          'oryx-button button'
        ) as HTMLButtonElement;
        button.click();
      });

      it('should dispatch submit event', () => {
        expect(spy).toHaveBeenCalled();
      });
    });

    describe('when user wants to edit a product', () => {
      const spy = vi.fn();

      beforeEach(async () => {
        const el = await fixture(
          html`
            <oryx-picking-product-card
              .productItem="${productItem}"
              status="${ItemsFilters.Picked}"
            ></oryx-picking-product-card>
          `
        );

        el.addEventListener('oryx.edit', spy);

        const button = el.shadowRoot?.querySelector(
          'oryx-button button'
        ) as HTMLButtonElement;
        button.click();
      });

      it('should dispatch edit event', () => {
        expect(spy).toHaveBeenCalled();
      });
    });

    describe('when a product is not provided', () => {
      beforeEach(async () => {
        element = await fixture(
          html`
            <oryx-picking-product-card
              status="${ItemsFilters.NotPicked}"
            ></oryx-picking-product-card>
          `
        );
      });

      it('should not render form quantity input', async () => {
        expect(
          element.shadowRoot?.querySelector(
            'oryx-cart-quantity-input'
          ) as QuantityInputComponent
        ).to.not.exist;
      });
    });
  });

  describe('when a product provided with status Picked', () => {
    beforeEach(async () => {
      element = await fixture(
        html`
          <oryx-picking-product-card
            .productItem="${productItem}"
            status="${ItemsFilters.Picked}"
          ></oryx-picking-product-card>
        `
      );
    });

    it('should not render quantity input', () => {
      expect(
        element.shadowRoot?.querySelector(
          'oryx-cart-quantity-input'
        ) as QuantityInputComponent
      ).to.not.exist;
    });

    it('should render summary info', () => {
      expect(element.shadowRoot?.querySelector('.summary-info')).to.exist;
    });

    it('should render edit button', () => {
      expect(
        element.shadowRoot
          ?.querySelector('oryx-button button')
          ?.textContent?.trim()
      ).toBe('Edit items');
    });
  });

  describe('when a product provided with status Not Found', () => {
    beforeEach(async () => {
      element = await fixture(
        html`
          <oryx-picking-product-card
            .productItem="${productItem}"
            status="${ItemsFilters.NotFound}"
          ></oryx-picking-product-card>
        `
      );
    });

    it('should render oryx-image with the image-fade class', () => {
      expect(
        element.renderRoot
          .querySelector('oryx-image')
          ?.classList.value.includes('image-fade')
      ).toBe(true);

      expect(
        (element.shadowRoot?.querySelector('oryx-image') as ImageComponent).src
      ).toBe(productItem.product.image);
    });

    it('should not render quantity input', () => {
      expect(
        element.shadowRoot?.querySelector(
          'oryx-cart-quantity-input'
        ) as QuantityInputComponent
      ).to.not.exist;
    });

    it('should render summary info', () => {
      expect(element.shadowRoot?.querySelector('.summary-info')).to.exist;
    });

    it('should render edit button', () => {
      expect(
        element.shadowRoot
          ?.querySelector('oryx-button button')
          ?.textContent?.trim()
      ).toBe('Edit items');
    });
  });
});
