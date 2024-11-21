import { HttpService, JsonAPITransformerService } from '@spryker-oryx/core';
import { HttpTestService } from '@spryker-oryx/core/testing';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { of } from 'rxjs';
import { GlueStoreAdapter } from './default-store.adapter';
import { StoreNormalizer } from './normalizers';
import { StoreAdapter } from './store.adapter';

const mockApiUrl = 'mockApiUrl';

const mockTransformer = {
  transform: vi.fn().mockReturnValue(of(null)),
  do: vi.fn().mockReturnValue(() => of(null)),
};

describe('GlueStoreAdapter', () => {
  let service: StoreAdapter;
  let http: HttpTestService;

  beforeEach(() => {
    const testInjector = createInjector({
      providers: [
        {
          provide: HttpService,
          useClass: HttpTestService,
        },
        {
          provide: StoreAdapter,
          useClass: GlueStoreAdapter,
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

    service = testInjector.inject(StoreAdapter);
    http = testInjector.inject(HttpService) as HttpTestService;
  });

  afterEach(() => {
    vi.clearAllMocks();
    destroyInjector();
  });

  it('should be provided', () => {
    expect(service).toBeInstanceOf(GlueStoreAdapter);
  });

  describe('get should send `get` request', () => {
    it('should build url', () => {
      service.get().subscribe();

      expect(http.url).toBe(`${mockApiUrl}/stores`);
    });

    it('should call transformer data with data from response', () => {
      service.get().subscribe();

      expect(mockTransformer.do).toHaveBeenCalledWith(StoreNormalizer);
    });

    it('should return transformed data', () => {
      const mockTransformerData = 'mockTransformerData';
      const callback = vi.fn();
      mockTransformer.do.mockReturnValue(() => of(mockTransformerData));

      service.get().subscribe(callback);

      expect(callback).toHaveBeenCalledWith(mockTransformerData);
    });
  });
});
