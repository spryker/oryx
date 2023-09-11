import { HttpService, JsonAPITransformerService } from '@spryker-oryx/core';
import { HttpTestService } from '@spryker-oryx/core/testing';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { of } from 'rxjs';
import { ApiProductModel } from '../../models';
import { DefaultProductAdapter } from './default-product.adapter';
import { ProductNormalizer } from './normalizers';
import { ProductAdapter } from './product.adapter';

const mockApiUrl = 'mockApiUrl';
const mockProduct = {
  data: {
    attributes: {
      name: 'mockProduct',
      sku: 'sku',
      averageRating: 0,
    },
  },
};
const mockTransformer = {
  do: vi.fn().mockReturnValue(() => of(null)),
};

describe('DefaultProductService', () => {
  let service: ProductAdapter;
  let http: HttpTestService;

  beforeEach(() => {
    const testInjector = createInjector({
      providers: [
        {
          provide: HttpService,
          useClass: HttpTestService,
        },
        {
          provide: ProductAdapter,
          useClass: DefaultProductAdapter,
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

    service = testInjector.inject(ProductAdapter);
    http = testInjector.inject(HttpService) as HttpTestService;
  });

  afterEach(() => {
    destroyInjector();
  });

  it('should be provided', () => {
    expect(service).toBeInstanceOf(DefaultProductAdapter);
  });

  describe('get', () => {
    const mockQualifier = { sku: '123' };
    const imageInclude = 'concrete-product-image-sets';
    const testInclude = 'test-include';

    beforeEach(() => {
      http.flush(mockProduct);
    });

    afterEach(() => {
      vi.clearAllMocks();
    });

    it('should build url based on SKU', () => {
      service.get(mockQualifier);

      expect(http.url).toContain(
        `${mockApiUrl}/concrete-products/${mockQualifier.sku}`
      );
    });

    it('should add include to the url', () => {
      service.get({
        ...mockQualifier,
        include: [imageInclude],
      });

      expect(http.url?.split('?include=')[1].split(',')).toContain(
        imageInclude
      );
    });

    it('should add several includes to the url', () => {
      const params = {
        ...mockQualifier,
        include: [imageInclude, testInclude],
      };

      service.get(params);

      const includes = http.url
        ?.split('?include=')[1]
        .split('&fields')[0]
        .split(',');
      expect(includes).toHaveLength(7);
    });

    it('should call transformer with proper normalizer', () => {
      service.get(mockQualifier).subscribe();

      expect(mockTransformer.do).toHaveBeenCalledWith(ProductNormalizer);
    });

    it('should return transformed data', () => {
      const mockTransformerData = 'mockTransformerData';
      const callback = vi.fn();
      mockTransformer.do.mockReturnValue(() => of(mockTransformerData));

      service.get(mockQualifier).subscribe(callback);

      expect(callback).toHaveBeenCalledWith(mockTransformerData);
    });

    describe('category-nodes fields', () => {
      const fields = `fields[${ApiProductModel.Includes.CategoryNodes}]=`;

      beforeEach(() => {
        service.get(mockQualifier);
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
        ApiProductModel.CategoryNodeFields.IsActive,
      ].forEach((field) =>
        it(`should contain ${field} in the url`, () => {
          expect(http.url?.split(fields)[1]).toContain(field);
        })
      );
    });
  });
});
