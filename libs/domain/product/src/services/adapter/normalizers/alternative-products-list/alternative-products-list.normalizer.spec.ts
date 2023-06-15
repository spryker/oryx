import {map, of} from 'rxjs';
import { DefaultAlternativeProductsListAdapter } from './default-alternative-products-list.adapter';
import { HttpService, JsonAPITransformerService } from '@spryker-oryx/core';
import {HttpTestService} from "@spryker-oryx/core/testing";
import {createInjector, destroyInjector} from "@spryker-oryx/di";
import {AlternativeProductsListAdapter, DefaultProductListAdapter, ProductListAdapter} from "@spryker-oryx/product";

const mockApiUrl = 'mockApiUrl';

class MockHttpService {
  get = vi.fn().mockReturnValue(of({}));
}

const mockTransformer = {
  do: vi.fn().mockReturnValue(() => of(null)),
};

describe('DefaultAlternativeProductsListAdapter', () => {
  let adapter: AlternativeProductsListAdapter;
  let http: HttpTestService;

  beforeEach(() => {
    const testInjector = createInjector({
      providers: [
        {
          provide: HttpService,
          useClass: HttpTestService,
        },
        {
          provide: AlternativeProductsListAdapter,
          useClass: DefaultAlternativeProductsListAdapter
        },
        {
          provide: 'SCOS_BASE_URL',
          useValue: mockApiUrl,
        },
        {
          provide: JsonAPITransformerService,
          useValue: mockTransformer,
        },
      ]
    })

    adapter = testInjector.inject(AlternativeProductsListAdapter) as DefaultAlternativeProductsListAdapter;
    http = testInjector.inject(HttpService) as HttpTestService;
  });

  afterEach(() => {
    destroyInjector();
  });

  it('should be provided', () => {
    expect(adapter).toBeInstanceOf(DefaultAlternativeProductsListAdapter);
  });
});