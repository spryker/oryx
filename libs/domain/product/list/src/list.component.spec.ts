import { fixture } from '@open-wc/testing-helpers';
import { useComponent } from '@spryker-oryx/core/utilities';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import {
  ProductListPageService,
  ProductListQualifier,
  ProductListService,
  SortParamNames,
} from '@spryker-oryx/product';
import { mockProductProviders } from '@spryker-oryx/product/mocks';
import { html } from 'lit';
import { of } from 'rxjs';
import { ProductListComponent } from './list.component';
import { productListComponent } from './list.def';

class MockProductListService implements Partial<ProductListService> {
  get = vi.fn();
}

class MockProductListPageService implements Partial<ProductListPageService> {
  get = vi.fn();
}

describe('ProductListComponent', () => {
  let element: ProductListComponent;
  let mockProductListService: MockProductListService;
  let mockProductListPageService: MockProductListPageService;

  beforeAll(async () => {
    await useComponent(productListComponent);
  });

  beforeEach(async () => {
    const testInjector = createInjector({
      providers: [
        ...mockProductProviders,
        {
          provide: ProductListService,
          useClass: MockProductListService,
        },
        {
          provide: ProductListPageService,
          useClass: MockProductListPageService,
        },
      ],
    });

    mockProductListService = testInjector.inject(
      ProductListService
    ) as unknown as MockProductListService;

    mockProductListPageService = testInjector.inject(
      ProductListPageService
    ) as unknown as MockProductListPageService;
  });

  afterEach(() => {
    destroyInjector();
  });

  describe('when the component is created', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-product-list
          .options="${{ q: 'sony' }}"
        ></oryx-product-list>`
      );
    });

    it('is defined', () => {
      expect(element).toBeInstanceOf(ProductListComponent);
    });

    it('passes the a11y audit', async () => {
      await expect(element).shadowDom.to.be.accessible();
    });
  });

  describe(`when options are provided`, () => {
    const queryOptions: ProductListQualifier[] = [
      { q: 'sony' },
      { minPrice: 1 },
      { maxPrice: 10 },
      { minRating: 3 },
      { storageCapacity: '5m2' },
      { brand: 'sony' },
      { label: 'label' },
      { weight: '5KG' },
      { color: 'red' },
      { category: 'cat' },
      { currency: 'EUR' },
      { sort: SortParamNames.Popularity },
      { page: 2 },
      { ipp: 5 },
    ];

    queryOptions.map((options) => {
      describe(`and the option is a product list option (${JSON.stringify(
        options
      )})`, () => {
        beforeEach(async () => {
          element = await fixture(
            html`<oryx-product-list .options=${options}></oryx-product-list>`
          );
        });

        it('should call the product list service with the query options', () => {
          expect(mockProductListService.get).toHaveBeenCalledWith(options);
        });
      });
    });

    describe(`and the option is not a product list option`, () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-product-list
            .options=${{ what: 'ever' }}
          ></oryx-product-list>`
        );
      });

      it('should not call the product list service', () => {
        expect(mockProductListService.get).not.toHaveBeenCalled();
      });

      it('should call the product page list service', () => {
        expect(mockProductListPageService.get).toHaveBeenCalled();
      });
    });
  });

  describe('when there are products resolved', () => {
    beforeEach(async () => {
      mockProductListPageService.get.mockReturnValue(
        of({ products: [{ sku: '123' }] })
      );
      element = await fixture(html`<oryx-product-list></oryx-product-list>`);
    });

    it('should render product cards', () => {
      expect(element).toContainElement('oryx-product-card');
    });
  });

  describe('when there is no result', () => {
    beforeEach(async () => {
      mockProductListPageService.get.mockReturnValue(of({}));
      element = await fixture(html`<oryx-product-list></oryx-product-list>`);
    });

    it('should not render product cards', () => {
      expect(element).not.toContainElement('oryx-product-card');
    });
  });

  describe('when there are no products resolved', () => {
    beforeEach(async () => {
      mockProductListPageService.get.mockReturnValue(of({ products: [] }));
      element = await fixture(html`<oryx-product-list></oryx-product-list>`);
    });

    it('should not render product cards', () => {
      expect(element).not.toContainElement('oryx-product-card');
    });
  });

  describe('layout', () => {
    describe('when a layout has been provided', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-product-list
            .options=${{ rules: [{ layout: 'foo-bar' }] }}
          ></oryx-product-list>`
        );
      });

      it('should wrap the list in the oryx-layout', () => {
        expect(element).toContainElement('oryx-layout');
      });
    });

    describe('when a layout has not been provided', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-product-list
            .options=${{ rules: [{}] }}
          ></oryx-product-list>`
        );
      });

      it('should wrap the list in the oryx-layout', () => {
        expect(element).not.toContainElement('oryx-layout');
      });
    });
  });

  describe('when user does not provide input', () => {
    beforeEach(async () => {
      // mockProductListPageService.get.mockReturnValue(of([]));
      element = await fixture(
        html`<oryx-product-list .options="${{ q: '' }}"></oryx-product-list>`
      );
    });

    it('should use user input to get data', () => {
      expect(mockProductListPageService.get).toHaveBeenCalled();
    });
  });
});
