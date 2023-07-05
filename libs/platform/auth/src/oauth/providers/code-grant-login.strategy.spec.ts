import { AuthLoginStrategy } from '@spryker-oryx/auth/login';
import { HttpService } from '@spryker-oryx/core';
import { HttpTestService } from '@spryker-oryx/core/testing';
import { createInjector, destroyInjector, getInjector } from '@spryker-oryx/di';
import { catchError, of } from 'rxjs';
import {
  CodeGrantAuthLoginStrategy,
  CodeGrantAuthLoginStrategyConfig,
} from './code-grant-login.strategy';

const mockConfig = {
  loginUrl: 'loginUrl',
  loginMethod: 'loginMethod',
};

describe('CodeGrantAuthLoginStrategy', () => {
  let service: AuthLoginStrategy;

  beforeEach(() => {
    vi.stubGlobal('location', { assign: vi.fn() });

    createInjector({
      providers: [
        {
          provide: HttpService,
          useClass: HttpTestService,
        },
        {
          provide: CodeGrantAuthLoginStrategyConfig,
          useValue: mockConfig,
        },
        {
          provide: AuthLoginStrategy,
          useClass: CodeGrantAuthLoginStrategy,
        },
      ],
    });

    service = getInjector().inject(AuthLoginStrategy);
  });

  afterEach(() => {
    vi.resetAllMocks();
    vi.unstubAllGlobals();
    destroyInjector();
  });

  it('should call URL.searchParams with proper params', async () => {
    const mockSearchParams = {
      get: vi.fn(),
      set: vi.fn(),
    };
    const mockUrl = vi.fn().mockReturnValue({ searchParams: mockSearchParams });
    vi.stubGlobal('URL', mockUrl);
    service.login({
      email: 'mockEmail',
      password: 'mockPassword',
      rememberMe: false,
    });
    expect(mockSearchParams.set).toHaveBeenNthCalledWith(
      1,
      'username',
      'mockEmail'
    );
    expect(mockSearchParams.set).toHaveBeenNthCalledWith(
      2,
      'password',
      'mockPassword'
    );
    expect(mockUrl).toHaveBeenCalledWith(globalThis.location.href);
  });

  it('should call request with proper params', async () => {
    const mockSearchParams = {
      get: vi.fn().mockReturnValue('mockGet'),
      set: vi.fn(),
    };
    const mockUrl = vi.fn().mockReturnValue({ searchParams: mockSearchParams });
    vi.stubGlobal('URL', mockUrl);
    const mockHttp = getInjector().inject(HttpService) as HttpTestService;
    mockHttp.flush([{ code: 'mockCode' }]);
    service
      .login({
        email: 'mockEmail',
        password: 'mockPassword',
        rememberMe: false,
      })
      .subscribe();
    expect(mockHttp.url).toBe(mockConfig.loginUrl);
    expect(mockHttp.options).toEqual({
      method: mockConfig.loginMethod,
      credentials: 'omit',
      body: mockSearchParams,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
  });

  it('should throw error if response has not `code`', async () => {
    const mockSearchParams = {
      get: vi.fn().mockReturnValue('mockGet'),
      set: vi.fn(),
    };
    const mockUrl = vi.fn().mockReturnValue({ searchParams: mockSearchParams });
    vi.stubGlobal('URL', mockUrl);
    const mockHttp = getInjector().inject(HttpService) as HttpTestService;
    mockHttp.flush([{}]);
    const callback = vi.fn();
    service
      .login({
        email: 'mockEmail',
        password: 'mockPassword',
        rememberMe: false,
      })
      .pipe(catchError((error) => of(callback(error))))
      .subscribe();
    expect(callback).toHaveBeenCalledWith(
      new Error('Missing code in response!')
    );
  });

  it('should throw error if url has not `redirect_uri`', async () => {
    const mockSearchParams = {
      get: vi.fn(),
      set: vi.fn(),
    };
    const mockUrl = vi.fn().mockReturnValue({ searchParams: mockSearchParams });
    vi.stubGlobal('URL', mockUrl);
    const mockHttp = getInjector().inject(HttpService) as HttpTestService;
    mockHttp.flush([{ code: 'code' }]);
    const callback = vi.fn();
    service
      .login({
        email: 'mockEmail',
        password: 'mockPassword',
        rememberMe: false,
      })
      .pipe(catchError((error) => of(callback(error))))
      .subscribe();
    expect(mockSearchParams.get).toHaveBeenCalledWith('redirect_uri');
    expect(callback).toHaveBeenCalledWith(
      new Error('Missing redirect_uri in URL params!')
    );
  });

  it('should call SearchParams.set with response params', async () => {
    const mockSearchParams = {
      get: vi.fn().mockReturnValue('value'),
      set: vi.fn(),
    };
    const mockUrl = vi.fn().mockReturnValue({ searchParams: mockSearchParams });
    vi.stubGlobal('URL', mockUrl);
    const mockHttp = getInjector().inject(HttpService) as HttpTestService;
    mockHttp.flush([{ code: 'codeV', param1: 'paramV' }]);
    const callback = vi.fn();
    service
      .login({
        email: 'mockEmail',
        password: 'mockPassword',
        rememberMe: false,
      })
      .pipe(catchError((error) => of(callback(error))))
      .subscribe();
    // First 2 calls are username and password
    expect(mockSearchParams.set).toHaveBeenNthCalledWith(3, 'code', 'codeV');
    expect(mockSearchParams.set).toHaveBeenNthCalledWith(4, 'param1', 'paramV');
  });
});
