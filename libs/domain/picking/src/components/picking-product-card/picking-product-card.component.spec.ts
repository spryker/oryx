import { fixture } from '@open-wc/testing-helpers';
import { QuantityInputComponent } from '@spryker-oryx/cart/quantity-input';
import { useComponent } from '@spryker-oryx/core/utilities';
import { ItemsFilters, PickingListItem } from '@spryker-oryx/picking';
import { ImageComponent } from '@spryker-oryx/ui/image';
import { html } from 'lit';
import { mockPickingListData } from '../../mocks';
import { PickingProductCardComponent } from './picking-product-card.component';
import { pickingProductCardComponent } from './picking-product-card.def';

describe('PickingProductCardComponent', () => {
  let element: PickingProductCardComponent;
  const productItem: PickingListItem = mockPickingListData[0].items[0];

  beforeAll(async () => {
    await useComponent(pickingProductCardComponent);
  });

  afterEach(() => {
    vi.clearAllMocks();
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
        element.renderRoot.querySelector("[slot='heading']")?.textContent
      ).toContain(productItem.orderItem.name);

      expect(element.renderRoot.querySelector('h6')?.textContent).toContain(
        productItem.orderItem.sku
      );
    });

    it('should not render oryx-image with the image-fade class', () => {
      expect(element).not.toContainElement('oryx-image.image-fade');

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
        expect(element).not.toContainElement('oryx-button button[disabled]');
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
          expect(element).toContainElement('oryx-button button[disabled]');
        });
      });
    });

    describe('when user submit a quantity', () => {
      const spy = vi.fn();

      beforeEach(async () => {
        element = await fixture(
          html`
            <oryx-picking-product-card
              .productItem="${productItem}"
              status="${ItemsFilters.NotPicked}"
              @oryx.submit=${spy}
            ></oryx-picking-product-card>
          `
        );

        const button = element.shadowRoot?.querySelector(
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
        const element = await fixture(
          html`
            <oryx-picking-product-card
              .productItem="${productItem}"
              status="${ItemsFilters.Picked}"
              @oryx.edit=${spy}
            ></oryx-picking-product-card>
          `
        );

        const button = element.shadowRoot?.querySelector(
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

      it('should not render form quantity input', () => {
        expect(element).not.toContainElement('oryx-cart-quantity-input');
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
      expect(element).not.toContainElement('oryx-cart-quantity-input');
    });

    it('should render summary info', () => {
      expect(element.shadowRoot?.querySelector('.summary-info')).to.exist;
    });

    it('should render edit button', () => {
      expect(
        element.shadowRoot?.querySelector('oryx-button button')?.textContent
      ).toContain('Edit items');
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
      expect(element).toContainElement('oryx-image.image-fade');

      expect(
        (element.shadowRoot?.querySelector('oryx-image') as ImageComponent).src
      ).toBe(productItem.product.image);
    });

    it('should not render quantity input', () => {
      expect(element).not.toContainElement('oryx-cart-quantity-input');
    });

    it('should render summary info', () => {
      expect(element).toContainElement('.summary-info');
    });

    it('should render edit button', () => {
      expect(
        element.shadowRoot?.querySelector('oryx-button button')?.textContent
      ).toContain('Edit items');
    });
  });
});
