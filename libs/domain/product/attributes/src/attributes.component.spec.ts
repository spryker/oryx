import { fixture } from '@open-wc/testing-helpers';
import { ContextService, DefaultContextService } from '@spryker-oryx/core';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { useComponent } from '@spryker-oryx/utilities';
import { html } from 'lit';
import { of } from 'rxjs';
import { ProductService } from '../../src/services';
import { ProductAttributesComponent } from './attributes.component';
import { productAttributesComponent } from './attributes.def';

class MockProductService implements Partial<ProductService> {
  get = vi.fn();
}

describe('Product attributes', () => {
  let element: ProductAttributesComponent;
  let productService: MockProductService;

  beforeAll(async () => {
    await useComponent(productAttributesComponent);
  });

  beforeEach(async () => {
    const injector = createInjector({
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

    productService = injector.inject<MockProductService>(ProductService);
  });

  afterEach(() => {
    destroyInjector();
  });

  describe('when the component is created', () => {
    beforeEach(async () => {
      element = await fixture(html`
        <oryx-product-attributes sku="1"></oryx-product-attributes>
      `);
    });

    it('should be defined', () => {
      expect(element).toBeInstanceOf(ProductAttributesComponent);
    });

    it('passes the a11y audit', async () => {
      await expect(element).shadowDom.to.be.accessible();
    });
  });

  describe('when there are attributes', () => {
    beforeEach(async () => {
      productService.get.mockReturnValue(
        of({
          sku: '1',
          attributes: {
            brand: 'Brand1',
            color: 'color1',
          },
          attributeNames: {
            brand: 'Brand',
            color: 'Color',
          },
        })
      );

      element = await fixture(html`
        <oryx-product-attributes sku="1"></oryx-product-attributes>
      `);
    });

    it('passes the a11y audit', async () => {
      await expect(element).shadowDom.to.be.accessible();
    });

    it('should render attribute terms', () => {
      expect(element).toContainElement('dt:nth-of-type(2)');
    });

    it('should render attribute values', () => {
      expect(element).toContainElement('dd:nth-of-type(2)');
    });

    describe('when a custom column count is provided', () => {
      beforeEach(async () => {
        element = await fixture(html`
          <oryx-product-attributes
            sku="1"
            .options=${{ columnCount: 3 }}
          ></oryx-product-attributes>
        `);
      });

      it('should have colum count style defined', () => {
        expect(
          element.shadowRoot
            ?.querySelector('dl')
            ?.style.getPropertyValue('--column-count')
        ).toBe('3');
      });
    });
  });

  describe('when no attributes available in product', () => {
    beforeEach(async () => {
      beforeEach(() => {
        productService.get.mockReturnValue(of({ sku: '1' }));
      });
      element = await fixture(html`
        <oryx-product-attributes sku="1"></oryx-product-attributes>
      `);
    });

    it('should not render any attributes', () => {
      expect(element).not.toContainElement('dt');
    });
  });
});
