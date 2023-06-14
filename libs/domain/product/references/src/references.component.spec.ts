import { fixture } from '@open-wc/testing-helpers';
import { ContextService } from '@spryker-oryx/core';
import { useComponent } from '@spryker-oryx/core/utilities';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { LayoutBuilder, LayoutService } from '@spryker-oryx/experience';
import {
  AlternativeProductsListService,
  ProductService,
} from '@spryker-oryx/product';
import { MockProductService } from '@spryker-oryx/product/mocks';
import { html } from 'lit';
import { of } from 'rxjs';
import { beforeEach } from 'vitest';
import { ProductReferencesComponent } from './references.component';
import { productReferencesComponent } from './references.def';

const mockSku = MockProductService.mockProducts[0].sku;

class MockContextService implements Partial<ContextService> {
  get = vi.fn().mockReturnValue(of(undefined));
}

class MockAlternativeProductsListService
  implements Partial<AlternativeProductsListService>
{
  get = vi.fn().mockReturnValue(of(MockProductService.mockProducts));
}

class MockLayoutBuilder implements Partial<LayoutBuilder> {
  createStylesFromOptions = vi.fn();
}

class MockLayoutService implements Partial<LayoutService> {
  getStyles = vi.fn().mockReturnValue(of(null));
}

describe('ReferencesComponent', () => {
  let element: ProductReferencesComponent;
  let mockAlternativeProductsService: MockAlternativeProductsListService;
  let mockContextService: MockContextService;

  const renderElement = async (): Promise<ProductReferencesComponent> => {
    return await fixture(
      html`<oryx-product-references></oryx-product-references>`
    );
  };

  beforeAll(async () => {
    await useComponent(productReferencesComponent);
  });

  beforeEach(async () => {
    const testInjector = createInjector({
      providers: [
        {
          provide: ContextService,
          useClass: MockContextService,
        },
        {
          provide: ProductService,
          useClass: MockProductService,
        },
        {
          provide: LayoutService,
          useClass: MockLayoutService,
        },
        {
          provide: LayoutBuilder,
          useClass: MockLayoutBuilder,
        },
        {
          provide: AlternativeProductsListService,
          useClass: MockAlternativeProductsListService,
        },
      ],
    });

    mockAlternativeProductsService = testInjector.inject(
      AlternativeProductsListService
    ) as unknown as MockAlternativeProductsListService;

    mockContextService = testInjector.inject(
      ContextService
    ) as unknown as MockContextService;

    element = await renderElement();
  });

  afterEach(() => {
    destroyInjector();
  });

  it('is defined', () => {
    expect(element).toBeInstanceOf(ProductReferencesComponent);
  });

  describe('when there is no product SKU in the context', () => {
    it('passes the a11y audit', async () => {
      await expect(element).shadowDom.to.be.accessible();
    });

    it('should call service "get" method', () => {
      expect(mockAlternativeProductsService.get).not.toHaveBeenCalledWith({
        sku: mockSku,
      });
    });

    it('should not render products', () => {
      expect(element).not.toContainElement('oryx-product-card');
    });
  });

  describe('when there is product SKU in the context', () => {
    beforeEach(async () => {
      mockContextService.get.mockReturnValue(of(mockSku));
      element = await renderElement();
    });

    it('passes the a11y audit', async () => {
      await expect(element).shadowDom.to.be.accessible();
    });

    it('should not call service "get" method', () => {
      expect(mockAlternativeProductsService.get).toHaveBeenCalledWith({
        sku: mockSku,
      });
    });

    it('should render product cards', () => {
      expect(
        element.renderRoot.querySelectorAll('oryx-product-card').length
      ).toBe(MockProductService.mockProducts.length);
    });

    describe('and there is no alternative products', () => {
      beforeEach(async () => {
        mockAlternativeProductsService.get.mockReturnValue(of(undefined));
        element = await renderElement();
      });

      it('should not render products', () => {
        expect(element).not.toContainElement('oryx-product-card');
      });
    });
  });
});
