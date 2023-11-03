import { nextFrame } from '@open-wc/testing-helpers';
import {
  DefaultHttpHandler,
  HttpHandler,
  HttpInterceptor,
} from '@spryker-oryx/core';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { LocaleService } from '@spryker-oryx/i18n';
import { of } from 'rxjs';
import { fromFetch } from 'rxjs/fetch';
import { Mock } from 'vitest';
import { AcceptLanguageInterceptor } from './accept-language.interceptor';

vi.mock('rxjs/fetch', () => ({
  fromFetch: vi.fn(),
}));

class MockLocaleService implements Partial<LocaleService> {
  get = vi.fn();
}

describe('AcceptLanguageInterceptor', () => {
  const SCOS_BASE_URL = 'http://example.com';

  let localeService: LocaleService;
  let handler: HttpHandler;

  beforeEach(() => {
    const testInjector = createInjector({
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
          provide: HttpInterceptor,
          useClass: AcceptLanguageInterceptor,
        },
        {
          provide: HttpHandler,
          useClass: DefaultHttpHandler,
        },
      ],
    });

    localeService = testInjector.inject(LocaleService);
    handler = testInjector.inject(HttpHandler);
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
      (fromFetch as Mock).mockReturnValue(of(null));
      const req = new Request(testCase.url, options);
      const expected = req.clone();

      if (testCase.shouldIntercept)
        expected.headers.set('Accept-Language', locale);

      handler.handle(req).subscribe();
      await nextFrame();
      expect(fromFetch).toHaveBeenCalledWith(
        testCase.shouldIntercept ? expected : req
      );
    });
  });
});
