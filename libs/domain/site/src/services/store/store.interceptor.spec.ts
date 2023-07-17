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
import { StoreInterceptor } from './store.interceptor';
import { StoreService } from './store.service';

vi.mock('rxjs/fetch', () => ({
  fromFetch: vi.fn(),
}));

class MockStoreService implements Partial<StoreService> {
  getAll = vi.fn();
  get = vi.fn();
}

describe('StoreInterceptor', () => {
  const SCOS_BASE_URL = 'http://example.com';
  const STORE = 'DE';

  let storeService: StoreService;
  let handler: HttpHandler;

  beforeEach(() => {
    const testInjector = createInjector({
      providers: [
        {
          provide: 'SCOS_BASE_URL',
          useValue: SCOS_BASE_URL,
        },
        {
          provide: StoreService,
          useClass: MockStoreService,
        },
        {
          provide: HttpInterceptor,
          useClass: StoreInterceptor,
        },
        {
          provide: HttpHandler,
          useClass: DefaultHttpHandler,
        },
      ],
    });

    storeService = testInjector.inject(StoreService);
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
      (storeService.getAll as Mock).mockReturnValue(of([{}, {}]));
      (storeService.get as Mock).mockReturnValue(of({ id: STORE }));
      (fromFetch as Mock).mockReturnValue(of(null));
      const req = new Request(testCase.url, options);
      const expected = req.clone();

      if (testCase.shouldIntercept) {
        expected.headers.set('X-Store', STORE);
      }

      handler.handle(req).subscribe();
      await nextFrame();
      expect(fromFetch).toHaveBeenCalledWith(
        testCase.shouldIntercept ? expected : req
      );
    });
  });

  it(`should not intercept if store only one`, async () => {
    const url = `${SCOS_BASE_URL}/unrelated-endpoint/some-id`;
    const options = {
      headers: {},
    };
    (storeService.getAll as Mock).mockReturnValue(of([{}]));
    (fromFetch as Mock).mockReturnValue(of(null));

    handler.handle(new Request(url, options)).subscribe();
    await nextFrame();
    expect(fromFetch).toHaveBeenCalledWith(new Request(url, options));
  });
});
