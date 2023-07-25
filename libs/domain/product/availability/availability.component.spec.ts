import { fixture, html } from '@open-wc/testing-helpers';
import { ContextService, DefaultContextService } from '@spryker-oryx/core';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { ProductService } from '@spryker-oryx/product';
import { AlertType } from '@spryker-oryx/ui';
import { SwatchComponent } from '@spryker-oryx/ui/swatch';
import { useComponent } from '@spryker-oryx/utilities';
import { of } from 'rxjs';
import { ProductAvailabilityComponent } from './availability.component';
import { productAvailabilityComponent } from './availability.def';

class MockProductService implements Partial<ProductService> {
  get = vi.fn();
}

const createElement = async (
  threshold?: number,
  enableIndicator = true,
  enableExactStock?: boolean
): Promise<ProductAvailabilityComponent> =>
  await fixture(
    html`<oryx-product-availability
      sku="1"
      .options=${{ threshold, enableIndicator, enableExactStock }}
    ></oryx-product-availability>`
  );

describe('ProductAvailabilityComponent', () => {
  let element: ProductAvailabilityComponent;
  let productService: MockProductService;

  beforeAll(async () => {
    await useComponent(productAvailabilityComponent);
  });

  beforeEach(() => {
    const testInjector = createInjector({
      providers: [
        {
          provide: ProductService,
          useClass: MockProductService,
        },
        {
          provide: ContextService,
          useClass: DefaultContextService,
        },
      ],
    });

    productService = testInjector.inject<MockProductService>(ProductService);
  });

  afterEach(() => {
    destroyInjector();
    vi.clearAllMocks();
  });

  describe('when the component is used in the DOM', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-product-availability></oryx-product-availability>`
      );
    });

    it('pass the a11y audit', async () => {
      await expect(element).shadowDom.to.be.accessible();
    });
  });

  describe('when isNeverOutOfStock is not provided', () => {
    describe('and the threshold is larger than the quantity', () => {
      beforeEach(async () => {
        productService.get.mockReturnValue(
          of({ availability: { quantity: 5 } })
        );
        element = await createElement(4);
      });

      it('should render oryx-swatch with type success', () => {
        expect(
          element.renderRoot.querySelector<SwatchComponent>('oryx-swatch')?.type
        ).toBe(AlertType.Success);
      });

      it('should render "Available"', () => {
        expect(element.renderRoot.textContent?.trim()).contain('Available');
      });
    });

    describe('and the threshold is equal to the quantity', () => {
      beforeEach(async () => {
        productService.get.mockReturnValue(
          of({ availability: { quantity: 5 } })
        );
        element = await createElement(5);
      });
      it('should render oryx-swatch with type success', () => {
        expect(
          element.renderRoot.querySelector<SwatchComponent>('oryx-swatch')?.type
        ).toBe(AlertType.Warning);
      });

      it('should render "Limited"', () => {
        expect(element.renderRoot.textContent?.trim()).contain('Limited');
      });
    });

    describe('and the threshold is larger than the quantity', () => {
      beforeEach(async () => {
        productService.get.mockReturnValue(
          of({ availability: { quantity: 5 } })
        );
        element = await createElement(6);
      });

      it('should render oryx-swatch with type success', () => {
        expect(
          element.renderRoot.querySelector<SwatchComponent>('oryx-swatch')?.type
        ).toBe(AlertType.Warning);
      });

      it('should render "Limited"', () => {
        expect(element.renderRoot.textContent?.trim()).contain('Limited');
      });
    });

    describe('and the threshold is 5 and the quantity is 0', () => {
      beforeEach(async () => {
        productService.get.mockReturnValue(
          of({ availability: { quantity: 0 } })
        );
        element = await createElement(5);
      });

      it('should render oryx-swatch with type success', () => {
        expect(
          element.renderRoot.querySelector<SwatchComponent>('oryx-swatch')?.type
        ).toBe(AlertType.Error);
      });

      it('should render "None"', () => {
        expect(element.renderRoot.textContent?.trim()).contain('None');
      });
    });
  });

  describe('when isNeverOutOfStock is true', () => {
    describe('and the quantity is 0', () => {
      beforeEach(async () => {
        productService.get.mockReturnValue(
          of({ availability: { quantity: 0, isNeverOutOfStock: true } })
        );
        element = await createElement();
      });

      it('should render oryx-swatch with type success', () => {
        expect(
          element.renderRoot.querySelector<SwatchComponent>('oryx-swatch')?.type
        ).toBe(AlertType.Success);
      });

      it('should render "Available"', () => {
        expect(element.renderRoot.textContent?.trim()).contain('Available');
      });
    });

    describe('and the quantity is undefined', () => {
      beforeEach(async () => {
        productService.get.mockReturnValue(
          of({ availability: { isNeverOutOfStock: true } })
        );
        element = await createElement();
      });

      it('should render oryx-swatch with type success', () => {
        expect(
          element.renderRoot.querySelector<SwatchComponent>('oryx-swatch')?.type
        ).toBe(AlertType.Success);
      });

      it('should render "Available"', () => {
        expect(element.renderRoot.textContent?.trim()).contain('Available');
      });
    });

    describe('and the threshold is lower than the quantity', () => {
      beforeEach(async () => {
        productService.get.mockReturnValue(
          of({ availability: { quantity: 4, isNeverOutOfStock: true } })
        );
        element = await createElement(5);
      });

      it('should render oryx-swatch with type success', () => {
        expect(
          element.renderRoot.querySelector<SwatchComponent>('oryx-swatch')?.type
        ).toBe(AlertType.Success);
      });

      it('should render "Available"', () => {
        expect(element.renderRoot.textContent?.trim()).contain('Available');
      });
    });

    describe('and enableIndicator option is false', () => {
      beforeEach(async () => {
        productService.get.mockReturnValue(
          of({ availability: { quantity: 4, isNeverOutOfStock: true } })
        );
        element = await createElement(5, false);
      });

      it('should not render the oryx-swatch element', () => {
        expect(element).not.toContainElement(`oryx-swatch`);
      });
    });
  });

  describe('when enableExactStock is true', () => {
    describe('and the product is in stock', () => {
      beforeEach(async () => {
        productService.get.mockReturnValue(
          of({ availability: { quantity: 10 } })
        );
        element = await createElement(5, false, true);
      });

      it('should render "Available 10"', () => {
        expect(element.renderRoot.textContent?.trim()).contain('Available 10');
      });
    });

    describe('and the product is low on stock', () => {
      beforeEach(async () => {
        productService.get.mockReturnValue(
          of({ availability: { quantity: 10 } })
        );
        element = await createElement(10, false, true);
      });

      it('should render "Limited 10"', () => {
        expect(element.renderRoot.textContent?.trim()).contain('Limited 10');
      });
    });

    describe('and the product is out of stock', () => {
      beforeEach(async () => {
        productService.get.mockReturnValue(
          of({ availability: { quantity: 0 } })
        );
        element = await createElement(10, false, true);
      });

      it('should render "None"', () => {
        expect(element.renderRoot.textContent?.trim()).contain('None');
      });
    });
  });
});
