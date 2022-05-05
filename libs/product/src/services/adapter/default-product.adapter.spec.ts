import { CoreServices } from '@spryker-oryx/core';
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
        provide: CoreServices.Http,
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
    http = testInjector.inject(CoreServices.Http) as HttpTestService;
  });

  it('should be provided', () => {
    expect(service).toBeInstanceOf(DefaultProductAdapter);
  });

  it('normalize method should return attributes from JSON_API_MODEL', () => {
    const result = service.normalize?.(mockProduct);
    expect(result).toEqual(mockProduct.data.attributes);
  });

  it('get should send `get` request', () => {
    const callback = vi.fn();
    const mockQualifier = { sku: '123' };

    http.flush(mockProduct);
    service.get(mockQualifier).subscribe(callback);

    expect(callback).toHaveBeenCalledWith(mockProduct.data.attributes);
    expect(http.url).toBe(
      `${mockApiUrl}/abstract-products/${mockQualifier.sku}`
    );
  });
});
