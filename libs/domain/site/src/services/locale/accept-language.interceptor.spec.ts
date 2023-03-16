import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { firstValueFrom, of } from 'rxjs';
import { Mock } from 'vitest';
import { AcceptLanguageInterceptor } from './accept-language.interceptor';
import { LocaleService } from './locale.service';

class MockLocaleService implements Partial<LocaleService> {
  get = vi.fn();
}

describe('AcceptLanguageInterceptor', () => {
  const SCOS_BASE_URL = 'http://example.com';

  let interceptor: AcceptLanguageInterceptor;
  let localeService: LocaleService;
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
          provide: LocaleService,
          useClass: MockLocaleService,
        },
        {
          provide: 'interceptor',
          useClass: AcceptLanguageInterceptor,
        },
      ],
    });

    interceptor = testInjector.inject('interceptor');
    localeService = testInjector.inject(LocaleService);
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
      shouldIntercept: true,
    },
    {
      url: `${SCOS_BASE_URL}/store/some-store-id`,
      shouldIntercept: false,
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
      const options = {
        headers: {},
      };
      const locale = 'en-US';
      (localeService.get as Mock).mockReturnValue(of(locale));

      handleMock.mockImplementation((url, modifiedOptions) => {
        if (testCase.shouldIntercept) {
          expect(modifiedOptions.headers['Accept-Language']).toBe(locale);
        } else {
          expect(modifiedOptions.headers['Accept-Language']).toBeUndefined();
        }
        return of(null);
      });

      await firstValueFrom(
        interceptor.intercept(testCase.url, options, handleMock)
      );
    });
  });
});
