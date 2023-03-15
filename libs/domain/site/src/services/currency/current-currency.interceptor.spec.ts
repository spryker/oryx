import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { firstValueFrom, of } from 'rxjs';
import { Mock } from 'vitest';
import { CurrencyService } from './currency.service';
import { CurrentCurrencyInterceptor } from './current-currency.interceptor';

class MockCurrencyService implements Partial<CurrencyService> {
  get = vi.fn();
}

describe('CurrentCurrencyInterceptor', () => {
  const SCOS_BASE_URL = 'http://example.com';

  let interceptor: CurrentCurrencyInterceptor;
  let currencyService: CurrencyService;
  let handleMock: Mock;
  let testInjector;

  beforeEach(() => {
    testInjector = createInjector({
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
          provide: 'interceptor',
          useClass: CurrentCurrencyInterceptor,
        },
      ],
    });

    interceptor = testInjector.inject('interceptor');
    currencyService = testInjector.inject(CurrencyService);
    handleMock = vi.fn();
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
      url: `${SCOS_BASE_URL}/concreete-product/some-product-id`,
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
      (currencyService.get as Mock).mockReturnValue(of(currency));

      handleMock.mockImplementation((url, options) => {
        if (testCase.shouldIntercept) {
          const expectedUrl = new URL(testCase.url);
          expectedUrl.searchParams.set('currency', currency);
          expect(url).toBe(expectedUrl.toString());
        } else {
          expect(url).toBe(testCase.url);
        }
        return of(null);
      });

      await firstValueFrom(
        interceptor.intercept(testCase.url, options, handleMock)
      );
    });
  });
});
