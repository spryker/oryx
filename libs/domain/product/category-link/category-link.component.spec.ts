import { fixture } from '@open-wc/testing-helpers';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { ProductCategory, ProductCategoryService } from '@spryker-oryx/product';
import { RouteType } from '@spryker-oryx/router';
import { useComponent } from '@spryker-oryx/utilities';
import { html } from 'lit';
import { of } from 'rxjs';
import { ProductCategoryLinkComponent } from './category-link.component';
import { productCategoryLinkComponent } from './category-link.def';

const mockCategories: ProductCategory[] = [
  {
    description: 'Computer',
    id: '5',
    name: 'Computer',
    order: 100,
  },
  {
    description: 'B Computer',
    id: '2',
    name: 'B Computer',
    order: 100,
  },
];

const mockProductCategoryService = {
  get: vi.fn(),
};

describe('ProductCategoryLinkComponent', () => {
  let element: ProductCategoryLinkComponent;

  beforeAll(async () => {
    await useComponent(productCategoryLinkComponent);
  });

  beforeEach(async () => {
    createInjector({
      providers: [
        {
          provide: ProductCategoryService,
          useValue: mockProductCategoryService,
        },
      ],
    });
  });

  afterEach(() => {
    destroyInjector();
    vi.resetAllMocks();
  });

  it('passes the a11y audit', async () => {
    element = await fixture(
      html`<oryx-product-category-link
        category=${mockCategories[0].id}
      ></oryx-product-category-link>`
    );

    await expect(element).shadowDom.to.be.accessible();
  });

  describe('when category is defined', () => {
    const test = (category: ProductCategory) =>
      it('should render oryx-content-link with proper properties', async () => {
        const contentLink =
          element.shadowRoot?.querySelector('oryx-content-link');

        expect(mockProductCategoryService.get).toHaveBeenCalledWith(
          category.id
        );
        expect(element).toContainElement('oryx-content-link');
        expect(contentLink).toHaveProperty('options', {
          type: RouteType.Category,
          id: category.id,
        });
        expect(contentLink).toHaveProperty('content', {
          text: category.name,
        });
      });

    describe('when category is property', () => {
      beforeEach(async () => {
        mockProductCategoryService.get.mockReturnValue(of(mockCategories[0]));

        element = await fixture(
          html`<oryx-product-category-link
            .options=${{ category: mockCategories[0].id }}
          ></oryx-product-category-link>`
        );
      });

      test(mockCategories[0]);
    });

    describe('when category is option', () => {
      beforeEach(async () => {
        mockProductCategoryService.get.mockReturnValue(of(mockCategories[1]));

        element = await fixture(
          html`<oryx-product-category-link
            category=${mockCategories[1].id}
          ></oryx-product-category-link>`
        );
      });

      test(mockCategories[1]);
    });
  });

  describe('when category is not defined', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-product-category-link></oryx-product-category-link>`
      );
    });

    it('should render nothing', () => {
      expect(mockProductCategoryService.get).not.toHaveBeenCalled();
      expect(element).not.toContainElement('oryx-content-link');
    });
  });
});
