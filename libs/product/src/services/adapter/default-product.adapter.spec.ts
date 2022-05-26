import { HttpService } from '@spryker-oryx/core';
import { HttpTestService } from '@spryker-oryx/core/testing';
import { Injector } from '@spryker-oryx/injector';
import { DefaultProductAdapter } from './default-product.adapter';
import { ProductAdapter } from './product.adapter';

const mockApiUrl = 'mockApiUrl';
const mockProduct = {
  data: {
    attributes: {
      name: 'mockProduct',
      sku: 'sku',
    },
  },
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
    ]);

    service = testInjector.inject(ProductAdapter);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    http = testInjector.inject(HttpService) as HttpTestService;
  });

  it('should be provided', () => {
    expect(service).toBeInstanceOf(DefaultProductAdapter);
  });

  it('normalize method should return attributes from JSON_API_MODEL', () => {
    const result = service.normalize?.(mockProduct);
    expect(result).toEqual(mockProduct.data.attributes);
  });

  describe('get should send `get` request', () => {
    const callback = vi.fn();
    const mockQualifier = { sku: '123' };
    const imageInclude = 'abstract-product-image-sets';
    const concreteProductInclude = 'concrete-products';

    beforeEach(() => {
      http.flush(mockProduct);
    });

    afterEach(() => {
      vi.clearAllMocks();
    });

    it('should build url based on SKU', () => {
      service.get(mockQualifier).subscribe(callback);

      expect(callback).toHaveBeenCalledWith(mockProduct.data.attributes);
      expect(http.url).toContain(
        `${mockApiUrl}/abstract-products/${mockQualifier.sku}`
      );
    });

    it('should add include to the url', () => {
      service
        .get({
          ...mockQualifier,
          include: [imageInclude],
        })
        .subscribe(callback);

      expect(http.url?.split('?include=')[1].split(',')).toContain(
        imageInclude
      );
    });

    it('should add several includes to the url', () => {
      const params = {
        ...mockQualifier,
        include: [imageInclude, concreteProductInclude],
      };

      service.get(params).subscribe(callback);

      const includes = http.url?.split('?include=')[1].split(',');

      expect(includes).toHaveLength(3);
    });
  });
});
