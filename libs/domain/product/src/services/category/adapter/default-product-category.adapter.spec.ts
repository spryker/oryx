import { HttpService, JsonAPITransformerService } from '@spryker-oryx/core';
import { HttpTestService } from '@spryker-oryx/core/testing';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { of } from 'rxjs';
import { ApiProductModel } from '../../../models';
import { DefaultProductCategoryAdapter } from './default-product-category.adapter';
import { CategoryNodeNormalizer, CategoryTreeNormalizer } from './normalizers';
import { ProductCategoryAdapter } from './product-category.adapter';

const mockApiUrl = 'mockApiUrl';
const mockTransformer = {
  do: vi.fn().mockReturnValue(() => of(null)),
};

describe('DefaultProductCategoryAdapter', () => {
  let adapter: ProductCategoryAdapter;
  let http: HttpTestService;

  beforeEach(() => {
    const testInjector = createInjector({
      providers: [
        {
          provide: HttpService,
          useClass: HttpTestService,
        },
        {
          provide: ProductCategoryAdapter,
          useClass: DefaultProductCategoryAdapter,
        },
        {
          provide: 'SCOS_BASE_URL',
          useValue: mockApiUrl,
        },
        {
          provide: JsonAPITransformerService,
          useValue: mockTransformer,
        },
      ],
    });

    adapter = testInjector.inject(ProductCategoryAdapter);
    http = testInjector.inject<HttpTestService>(HttpService);
  });

  afterEach(() => {
    destroyInjector();
    vi.clearAllMocks();
  });

  describe('get', () => {
    const mockCategoryId = 'mockId';
    const fields = `fields[${ApiProductModel.Includes.CategoryNodes}]=`;

    beforeEach(() => {
      adapter.get(mockCategoryId);
    });

    it('should build url based on category id', () => {
      expect(http.url).toContain(
        `${mockApiUrl}/category-nodes/${mockCategoryId}`
      );
    });

    it('should add fields for category-nodes to the url', () => {
      expect(http.url).toContain(fields);
    });

    [
      ApiProductModel.CategoryNodeFields.MetaDescription,
      ApiProductModel.CategoryNodeFields.NodeId,
      ApiProductModel.CategoryNodeFields.Order,
      ApiProductModel.CategoryNodeFields.Name,
      ApiProductModel.CategoryNodeFields.Parents,
    ].forEach((field) =>
      it(`should contain ${field} in the url`, () => {
        expect(http.url?.split(fields)[1]).toContain(field);
      })
    );

    it('should call transformer with category node normalizer', () => {
      expect(mockTransformer.do).toHaveBeenCalledWith(CategoryNodeNormalizer);
    });
  });

  describe('getTree', () => {
    beforeEach(() => {
      adapter.getTree();
    });

    it('should build the url', () => {
      expect(http.url).toContain(`${mockApiUrl}/category-trees`);
    });

    it('should call transformer with category tree normalizer', () => {
      expect(mockTransformer.do).toHaveBeenCalledWith(CategoryTreeNormalizer);
    });
  });
});
