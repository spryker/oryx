import { fixture, html } from '@open-wc/testing-helpers';
import { ContextService, DefaultContextService } from '@spryker-oryx/core';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { ProductService } from '@spryker-oryx/product';
import { AlertType } from '@spryker-oryx/ui';
import { SwatchComponent } from '@spryker-oryx/ui/swatch';
import { i18n, useComponent } from '@spryker-oryx/utilities';
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

  describe('when the availability has a quantity of 10', () => {
    beforeEach(async () => {
      productService.get.mockReturnValue(
        of({ availability: { quantity: 10 } })
      );
    });

    describe('and no options are provided', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-product-availability sku="1"></oryx-product-availability>`
        );
      });

      it('should render available message', () => {
        expect(element.renderRoot.textContent?.trim()).contain(
          i18n('product.availability.available')
        );
      });

      it('should render oryx-swatch with type success', () => {
        const swatch =
          element.renderRoot.querySelector<SwatchComponent>('oryx-swatch');
        expect(swatch?.type).toBe(AlertType.Success);
      });
    });

    describe('and the enableIndicator option is false', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-product-availability
            sku="1"
            .options=${{ enableIndicator: false }}
          ></oryx-product-availability>`
        );
      });

      it('should not render oryx-swatch with type success', () => {
        expect(element).not.toContainElement('oryx-swatch');
      });

      it('should render available message', () => {
        expect(element.renderRoot.textContent?.trim()).contain(
          i18n('product.availability.available')
        );
      });
    });

    describe('and the hideInStock option is true', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-product-availability
            sku="1"
            .options=${{ hideInStock: true }}
          ></oryx-product-availability>`
        );
      });

      it('should not render anything', () => {
        expect(element).not.toContainElement('*:not(style)');
      });
    });

    describe('and the threshold is lower', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-product-availability
            sku="1"
            .options=${{ threshold: 9 }}
          ></oryx-product-availability>`
        );
      });

      it('should render oryx-swatch with type Success', () => {
        expect(
          element.renderRoot.querySelector<SwatchComponent>('oryx-swatch')?.type
        ).toBe(AlertType.Success);
      });

      it('should render "None"', () => {
        expect(element.renderRoot.textContent?.trim()).contain(
          i18n('product.availability.available')
        );
      });
    });

    describe('and the threshold is equal', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-product-availability
            sku="1"
            .options=${{ threshold: 10 }}
          ></oryx-product-availability>`
        );
      });

      it('should render oryx-swatch with type warning', () => {
        expect(
          element.renderRoot.querySelector<SwatchComponent>('oryx-swatch')?.type
        ).toBe(AlertType.Warning);
      });

      it('should render the "Limited" message', () => {
        expect(element.renderRoot.textContent?.trim()).contain(
          i18n('product.availability.limited')
        );
      });
    });

    describe('and the threshold is larger', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-product-availability
            sku="1"
            .options=${{ threshold: 101 }}
          ></oryx-product-availability>`
        );
      });

      it('should render oryx-swatch with type warning', () => {
        expect(
          element.renderRoot.querySelector<SwatchComponent>('oryx-swatch')?.type
        ).toBe(AlertType.Warning);
      });

      it('should render "Limited"', () => {
        expect(element.renderRoot.textContent?.trim()).contain(
          i18n('product.availability.limited')
        );
      });
    });
  });

  describe('when the availability has a quantity of 10 and isNeverOutOfStock = true', () => {
    beforeEach(async () => {
      productService.get.mockReturnValue(
        of({ availability: { quantity: 10, isNeverOutOfStock: true } })
      );
    });

    describe('and the threshold is equal to the quantity', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-product-availability
            sku="1"
            .options=${{ threshold: 100 }}
          ></oryx-product-availability>`
        );
      });

      it('should render oryx-swatch with type Success', () => {
        expect(
          element.renderRoot.querySelector<SwatchComponent>('oryx-swatch')?.type
        ).toBe(AlertType.Success);
      });

      it('should render available message', () => {
        expect(element.renderRoot.textContent?.trim()).contain(
          i18n('product.availability.available')
        );
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
