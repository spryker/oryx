import { HttpHandlerFn } from '@spryker-oryx/core';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { lastValueFrom, of } from 'rxjs';
import { ApiCartModel } from '../../../models';
import { CartVersionInterceptor } from './cart-version.interceptor';

describe('CartVersionInterceptor', () => {
  const SCOS_BASE_URL = 'http://example.com';
  let interceptor: CartVersionInterceptor;

  beforeEach(() => {
    const testInjector = createInjector({
      providers: [
        {
          provide: 'SCOS_BASE_URL',
          useValue: SCOS_BASE_URL,
        },
        {
          provide: 'interceptor',
          useClass: CartVersionInterceptor,
        },
      ],
    });

    interceptor = testInjector.inject('interceptor');
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
      url: `${SCOS_BASE_URL}/${ApiCartModel.UrlParts.Carts}/some-id`,
      shouldIntercept: true,
    },
  ];

  testCases.forEach((testCase) => {
    const testName = testCase.shouldIntercept
      ? 'should intercept the request'
      : 'should not intercept the request';

    it(`${testName}: ${testCase.url}`, async () => {
      expect(
        interceptor.shouldInterceptRequest({ url: testCase.url } as Request)
      ).toBe(testCase.shouldIntercept);
    });
  });

  it(`should add version for object response`, async () => {
    const mockData = {
      data: {
        attributes: {
          a: 'a',
        },
      },
      test: 'test',
    };
    const handle = ((req: Request) => of(req)) as unknown as HttpHandlerFn;
    const req = {
      clone: () => ({
        json: () => of(mockData),
      }),
      headers: {
        get: () => 'etag',
      },
    } as unknown as Request;

    const response = await lastValueFrom(interceptor.intercept(req, handle));
    const body = await response.json();

    expect(body.data.attributes.version).toBe('etag');
  });

  it(`should add version for array response`, async () => {
    const mockData = {
      data: [
        {
          attributes: {
            a: 'a',
          },
        },
        {
          attributes: {
            a: 'b',
          },
        },
      ],
      test: 'test',
    };
    const handle = ((req: Request) => of(req)) as unknown as HttpHandlerFn;
    const req = {
      clone: () => ({
        json: () => of(mockData),
      }),
      headers: {
        get: () => 'etag',
      },
    } as unknown as Request;

    const response = await lastValueFrom(interceptor.intercept(req, handle));
    const body = await response.json();

    expect(body.data[0].attributes.version).toBe('etag');
    expect(body.data[1].attributes.version).toBe('etag');
  });

  it(`should use the same response if etag is not exist`, async () => {
    const mockData = {
      data: {
        attributes: {
          a: 'a',
        },
      },
      test: 'test',
    };
    const handle = ((req: Request) => of(req)) as unknown as HttpHandlerFn;
    const req = {
      clone: () => ({
        json: () => of(mockData),
      }),
      headers: {
        get: () => false,
      },
    } as unknown as Request;

    const response = await lastValueFrom(interceptor.intercept(req, handle));

    expect(response).toBe(req);
  });
});
