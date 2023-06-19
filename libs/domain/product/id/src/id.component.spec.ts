import { fixture } from '@open-wc/testing-helpers';
import { ContextService, DefaultContextService } from '@spryker-oryx/core';
import { useComponent } from '@spryker-oryx/core/utilities';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { html } from 'lit';
import { of } from 'rxjs';
import { ProductService } from '../../src/services';
import { ProductIdComponent } from './id.component';
import { productIdComponent } from './id.def';

class MockProductService implements Partial<ProductService> {
  get = vi.fn();
}

describe('ProductIdComponent', () => {
  let element: ProductIdComponent;
  let productService: MockProductService;

  beforeAll(async () => {
    await useComponent(productIdComponent);
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

  describe('when a product is provided ', () => {
    beforeEach(() => {
      productService.get.mockReturnValue(of({ sku: '123' }));
    });

    describe('and no prefix is provided', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-product-id
            sku="123"
            .options=${{ prefix: 'Test prefix' }}
          ></oryx-product-id>`
        );
      });

      it('passes the a11y audit', async () => {
        await expect(element).shadowDom.to.be.accessible();
      });

      it('should render sku prefix', () => {
        expect(element.shadowRoot?.textContent).toContain('Test prefix');
      });

      it('should render sku', () => {
        expect(element.shadowRoot?.textContent).toContain('123');
      });
    });

    describe('and prefix is not provided', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-product-id sku="123" .options=${{}}></oryx-product-id>`
        );
      });

      it('should render default sku prefix', () => {
        expect(element.shadowRoot?.textContent).toContain('SKU: ');
      });
    });
  });
});
