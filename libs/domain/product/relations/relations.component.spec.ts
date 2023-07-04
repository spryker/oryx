import { fixture } from '@open-wc/testing-helpers';
import { ContextService } from '@spryker-oryx/core';
import { useComponent } from '@spryker-oryx/core/utilities';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { LayoutBuilder, LayoutService } from '@spryker-oryx/experience';
import {
  ProductRelationsListService,
  ProductService,
} from '@spryker-oryx/product';
import { MockProductService } from '@spryker-oryx/product/mocks';
import { html } from 'lit';
import { of } from 'rxjs';
import { beforeEach } from 'vitest';
import { ProductRelationsComponent } from './relations.component';
import { productRelationsComponent } from './relations.def';

const mockSku = MockProductService.mockProducts[0].sku;

class MockContextService implements Partial<ContextService> {
  get = vi.fn().mockReturnValue(of(undefined));
}

class MockProductRelationsListService
  implements Partial<ProductRelationsListService>
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
  let element: ProductRelationsComponent;
  let mockProductRelationsListService: MockProductRelationsListService;
  let mockContextService: MockContextService;

  const renderElement = async (): Promise<ProductRelationsComponent> => {
    return await fixture(
      html`<oryx-product-relations></oryx-product-relations>`
    );
  };

  beforeAll(async () => {
    await useComponent(productRelationsComponent);
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
          provide: ProductRelationsListService,
          useClass: MockProductRelationsListService,
        },
      ],
    });

    mockProductRelationsListService = testInjector.inject(
      ProductRelationsListService
    ) as unknown as MockProductRelationsListService;

    mockContextService = testInjector.inject(
      ContextService
    ) as unknown as MockContextService;

    element = await renderElement();
  });

  afterEach(() => {
    vi.clearAllMocks();
    destroyInjector();
  });

  it('is defined', () => {
    expect(element).toBeInstanceOf(ProductRelationsComponent);
  });

  describe('when there is no product SKU in the context', () => {
    it('passes the a11y audit', async () => {
      await expect(element).shadowDom.to.be.accessible();
    });

    it('should call service "get" method', () => {
      expect(mockProductRelationsListService.get).not.toHaveBeenCalledWith({
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
      expect(mockProductRelationsListService.get).toHaveBeenCalledWith({
        sku: mockSku,
      });
    });

    it('should render product cards', () => {
      expect(
        element.renderRoot.querySelectorAll('oryx-product-card').length
      ).toBe(MockProductService.mockProducts.length);
    });

    describe('and there is no related products', () => {
      beforeEach(async () => {
        mockProductRelationsListService.get.mockReturnValue(of(undefined));
        element = await renderElement();
      });

      it('should not render products', () => {
        expect(element).not.toContainElement('oryx-product-card');
      });
    });
  });
});
