import { HttpService, JsonAPITransformerService } from '@spryker-oryx/core';
import { HttpTestService } from '@spryker-oryx/core/testing';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { of } from 'rxjs';
import {
  MerchantAdapter,
  MerchantNormalizer,
} from '../../../src/services/adapter/merchant.adapter';
import { DefaultMerchantAdapter } from './default-merchant.adapter';

const mockApiUrl = 'mockApiUrl';
const mockMerchant = {
  data: {
    attributes: {
      name: 'mockMerchant',
      id: 'merchantId',
    },
  },
};
const mockTransformer = {
  do: vi.fn().mockReturnValue(() => of(null)),
};

describe('DefaultMerchantAdapter', () => {
  let service: MerchantAdapter;
  let http: HttpTestService;

  beforeEach(() => {
    const testInjector = createInjector({
      providers: [
        {
          provide: HttpService,
          useClass: HttpTestService,
        },
        {
          provide: MerchantAdapter,
          useClass: DefaultMerchantAdapter,
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

    service = testInjector.inject(MerchantAdapter);
    http = testInjector.inject(HttpService) as HttpTestService;
  });

  afterEach(() => {
    destroyInjector();
  });

  it('should be provided', () => {
    expect(service).toBeInstanceOf(DefaultMerchantAdapter);
  });

  describe('get', () => {
    const mockQualifier = { id: '123' };
    const mockInclude = ['merchant-opening-hours', 'merchant-addresses'];

    beforeEach(() => {
      http.flush(mockMerchant);
    });

    afterEach(() => {
      vi.clearAllMocks();
    });

    it('should build url based on ID', () => {
      service.get(mockQualifier);

      expect(http.url).toContain(`${mockApiUrl}/merchants/${mockQualifier.id}`);
    });

    it('should include specific parameters in the url', () => {
      service.get(mockQualifier);

      expect(http.url).toContain(`?include=${mockInclude.join(',')}`);
    });

    it('should call transformer with proper normalizer', () => {
      service.get(mockQualifier).subscribe();

      expect(mockTransformer.do).toHaveBeenCalledWith(MerchantNormalizer);
    });

    it('should return transformed data', () => {
      const mockTransformerData = 'mockTransformerData';
      const callback = vi.fn();
      mockTransformer.do.mockReturnValue(() => of(mockTransformerData));

      service.get(mockQualifier).subscribe(callback);

      expect(callback).toHaveBeenCalledWith(mockTransformerData);
    });
  });
});
