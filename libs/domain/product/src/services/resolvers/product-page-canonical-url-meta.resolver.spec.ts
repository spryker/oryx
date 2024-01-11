import { ContextService } from '@spryker-oryx/core';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import {
  PRODUCT,
  ProductPageCanonicalUrlResolver,
} from '@spryker-oryx/product';
import { LinkService, RouterService } from '@spryker-oryx/router';
import { of } from 'rxjs';

const mockContextService = {
  get: vi.fn(),
};

const mockRouterService = {
  currentRoute: vi.fn(),
};

const mockLinkService = {
  get: vi.fn(),
};

describe('ProductPageCanonicalUrlResolver', () => {
  let service: ProductPageCanonicalUrlResolver;
  let linkService: LinkService;

  beforeEach(() => {
    const testInjector = createInjector({
      providers: [
        {
          provide: ProductPageCanonicalUrlResolver,
          useClass: ProductPageCanonicalUrlResolver,
        },
        {
          provide: ContextService,
          useValue: mockContextService,
        },
        {
          provide: RouterService,
          useValue: mockRouterService,
        },
        {
          provide: LinkService,
          useValue: mockLinkService,
        },
      ],
    });

    service = testInjector.inject(ProductPageCanonicalUrlResolver);
    linkService = testInjector.inject(LinkService);
  });

  afterEach(() => {
    destroyInjector();
    vi.resetAllMocks();
  });

  describe('getScore', () => {
    it('should return proper value if product exist', () => {
      const callback = vi.fn();
      mockContextService.get.mockReturnValue(of('sku'));
      mockRouterService.currentRoute.mockReturnValue(of('/product/saf'));
      service.getScore().subscribe(callback);
      expect(callback).toHaveBeenCalledWith(['sku', true]);
    });

    it('should return proper value if product is not exist', () => {
      const callback = vi.fn();
      mockContextService.get.mockReturnValue(of(undefined));
      mockRouterService.currentRoute.mockReturnValue(of(''));

      service.getScore().subscribe(callback);
      expect(callback).toHaveBeenCalledWith([undefined, false]);
    });
  });

  const callback = vi.fn();

  describe('when the qualifier contains other fields', () => {
    beforeEach(() => {
      mockContextService.get.mockReturnValue(of({ sku: '123', offer: 'abc' }));
      mockLinkService.get.mockReturnValue(of('/my-url'));
      service.resolve().subscribe(callback);
    });

    it('should request the link for the SKU only', () => {
      expect(linkService.get).toHaveBeenCalledWith({
        type: PRODUCT,
        qualifier: { sku: '123' },
      });
    });

    it('should resolve the link in the canonical field', () => {
      expect(callback).toHaveBeenCalledWith({
        canonical: 'http://localhost:3000/my-url',
      });
    });
  });
});
