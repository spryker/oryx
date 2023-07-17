import { nextFrame } from '@open-wc/testing-helpers';
import {
  DefaultHttpHandler,
  HttpHandler,
  HttpInterceptor,
} from '@spryker-oryx/core';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { of } from 'rxjs';
import { fromFetch } from 'rxjs/fetch';
import { Mock } from 'vitest';
import { CurrencyService } from './currency.service';
import { CurrentCurrencyInterceptor } from './current-currency.interceptor';

vi.mock('rxjs/fetch', () => ({
  fromFetch: vi.fn(),
}));

class MockCurrencyService implements Partial<CurrencyService> {
  get = vi.fn();
}

describe('CurrentCurrencyInterceptor', () => {
  const SCOS_BASE_URL = 'http://example.com';

  let interceptor: CurrentCurrencyInterceptor;
  let currencyService: CurrencyService;
  let handler: HttpHandler;

  beforeEach(() => {
    const testInjector = createInjector({
      providers: [
        {
          provide: 'SCOS_BASE_URL',
          useValue: SCOS_BASE_URL,
        },
        {
          provide: CurrencyService,
          useClass: MockCurrencyService,
        },
        {
          provide: HttpInterceptor,
          useClass: CurrentCurrencyInterceptor,
        },
        {
          provide: HttpHandler,
          useClass: DefaultHttpHandler,
        },
      ],
    });

    handler = testInjector.inject(HttpHandler);
    currencyService = testInjector.inject(CurrencyService);
  });

  afterEach(() => {
    vi.clearAllMocks();
    destroyInjector();
  });

  const testCases = [
    {
      url: 'http://another-domain.com/some-endpoint',
      shouldIntercept: false,
    },
    {
      url: `${SCOS_BASE_URL}/unrelated-endpoint/some-id`,
      shouldIntercept: false,
    },
    {
      url: `${SCOS_BASE_URL}/concrete-products/some-product-id`,
      shouldIntercept: true,
    },
    {
      url: `${SCOS_BASE_URL}/catalog-search/some-search-term`,
      shouldIntercept: true,
    },
    {
      url: `${SCOS_BASE_URL}/catalog-search-suggestions/some-search-term`,
      shouldIntercept: true,
    },
  ];

  testCases.forEach((testCase) => {
    const testName = testCase.shouldIntercept
      ? 'should intercept the request'
      : 'should not intercept the request';

    it(`${testName}: ${testCase.url}`, async () => {
      const options = {};
      const currency = 'USD';
      const expectedUrl = new URL(testCase.url);
      expectedUrl.searchParams.set('currency', currency);

      (currencyService.get as Mock).mockReturnValue(of(currency));
      (fromFetch as Mock).mockReturnValue(of(null));
      const req = new Request(testCase.url, options);
      const expected = testCase.shouldIntercept
        ? new Request(expectedUrl.toString(), req)
        : req;

      handler.handle(new Request(testCase.url, options)).subscribe();
      await nextFrame();
      expect(fromFetch).toHaveBeenCalledWith(expected);
    });
  });
});
