import { fixture } from '@open-wc/testing-helpers';
import { ContextService, DefaultContextService } from '@spryker-oryx/core';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import {
  ProductService,
  productDiscontinuedComponent,
} from '@spryker-oryx/product';
import { i18n, useComponent } from '@spryker-oryx/utilities';
import { html } from 'lit';
import { of } from 'rxjs';
import { ProductDiscontinuedComponent } from './discontinued.component';

class MockProductService implements Partial<ProductService> {
  get = vi.fn();
}

describe('ProductDiscontinuedComponent', () => {
  let element: ProductDiscontinuedComponent;
  let productService: MockProductService;

  beforeAll(async () => {
    await useComponent(productDiscontinuedComponent);
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

  describe('when the product is not discontinued', () => {
    beforeEach(async () => {
      productService.get.mockReturnValue(of({}));
      element = await fixture(
        html`<oryx-product-discontinued sku="1"></oryx-product-discontinued>`
      );
    });

    it('should not render a message', async () => {
      expect(element.renderRoot.textContent).toEqual('');
    });
  });

  describe('when the product is discontinued but does not have a note', () => {
    beforeEach(async () => {
      productService.get.mockReturnValue(of({ discontinued: true }));
      element = await fixture(
        html`<oryx-product-discontinued sku="1"></oryx-product-discontinued>`
      );
    });

    it('should render the discontinued i18n message', async () => {
      expect(element.renderRoot.textContent).toEqual(
        i18n('product.discontinued')
      );
    });
  });

  describe('when the product is discontinued and has a note', () => {
    beforeEach(async () => {
      productService.get.mockReturnValue(
        of({ discontinued: true, discontinuedNote: 'test' })
      );
      element = await fixture(
        html`<oryx-product-discontinued sku="1"></oryx-product-discontinued>`
      );
    });

    it('should render the discontinued note', async () => {
      expect(element.renderRoot.textContent).toEqual('test');
    });
  });
});
