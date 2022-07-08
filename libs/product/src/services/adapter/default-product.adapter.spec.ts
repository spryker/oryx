import { HttpService, JsonAPITransformerService } from '@spryker-oryx/core';
import { HttpTestService } from '@spryker-oryx/core/testing';
import { Injector } from '@spryker-oryx/injector';
import { of } from 'rxjs';
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
  transform: vi.fn().mockReturnValue(of(null)),
};

describe('DefaultProductService', () => {
  let service: ProductAdapter;
  let http: HttpTestService;
  let testInjector;

  beforeEach(() => {
    testInjector = new Injector([
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
    ]);

    service = testInjector.inject(ProductAdapter);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    http = testInjector.inject(HttpService) as HttpTestService;
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

      const includes = http.url?.split('?include=')[1].split(',');
      expect(includes).toHaveLength(3);
    });

    it('should call transformer data with data from response', () => {
      service.get(mockQualifier).subscribe();

      expect(mockTransformer.transform).toHaveBeenCalledWith(
        mockProduct,
        ProductNormalizer
      );
    });

    it('should return transformed data', () => {
      const mockTransformerData = 'mockTransformerData';
      const callback = vi.fn();
      mockTransformer.transform.mockReturnValue(of(mockTransformerData));

      service.get(mockQualifier).subscribe(callback);

      expect(callback).toHaveBeenCalledWith(mockTransformerData);
    });
  });
});
