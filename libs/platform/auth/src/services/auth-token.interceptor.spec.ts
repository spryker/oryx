import { createInjector, destroyInjector, getInjector } from '@spryker-oryx/di';
import { of, throwError } from 'rxjs';
import {
  AuthTokenInterceptor,
  AuthTokenInterceptorConfig,
} from './auth-token.interceptor';
import { AuthTokenService } from './auth-token.service';

const mockAuthTokenService = {
  getToken: vi.fn(),
};

const mockConfig: Record<string, string> = {
  headerName: 'mockHeaderName',
};

describe('AuthTokenInterceptor', () => {
  let service: AuthTokenInterceptor;

  beforeEach(() => {
    createInjector({
      providers: [
        {
          provide: AuthTokenService,
          useValue: mockAuthTokenService,
        },
        {
          provide: AuthTokenInterceptorConfig,
          useValue: mockConfig,
        },
        {
          provide: AuthTokenInterceptor,
          useClass: AuthTokenInterceptor,
        },
      ],
    });

    service = getInjector().inject(AuthTokenInterceptor);
  });

  afterEach(() => {
    vi.resetAllMocks();
    vi.unstubAllGlobals();
    destroyInjector();
  });

  describe('intercept', () => {
    it('should add new headers', () => {
      const mockHeadersMethods = {
        set: vi.fn(),
      };
      const mockHeaders = vi.fn().mockReturnValue(mockHeadersMethods);
      vi.stubGlobal('Headers', mockHeaders);
      const headers = { param1: 'value1' };
      const mockHandle = vi.fn().mockReturnValue(of(null));
      mockAuthTokenService.getToken.mockReturnValue(
        of({
          type: 'bearer',
          token: 'mockToken',
        })
      );
      service
        .intercept(
          'mockUrl',
          { body: 'value1', method: 'POST', headers },
          mockHandle
        )
        .subscribe();
      expect(mockAuthTokenService.getToken).toHaveBeenCalled();
      expect(mockHeaders).toHaveBeenCalledWith(headers);
      expect(mockHeadersMethods.set).toHaveBeenCalledWith(
        mockConfig.headerName,
        'Bearer mockToken'
      );
    });

    it('should not add new headers if token is not anon type', () => {
      const mockHeaders = vi.fn();
      vi.stubGlobal('Headers', mockHeaders);
      const headers = { param1: 'value1' };
      const mockHandle = vi.fn().mockReturnValue(of(null));
      mockAuthTokenService.getToken.mockReturnValue(
        of({
          type: 'not-bearer',
          token: 'mockToken',
        })
      );
      service
        .intercept(
          'mockUrl',
          { body: 'value1', method: 'POST', headers },
          mockHandle
        )
        .subscribe();
      expect(mockHeaders).not.toHaveBeenCalled();
    });

    it('should call handle with options with generated headers', () => {
      const headers = { param1: 'value1' };
      const mockUrl = 'mockUrl';
      const mockOptions = { body: 'value1', method: 'POST', headers };
      const mockHandle = vi.fn().mockReturnValue(of(null));
      const mockHeadersMethods = {
        set: vi.fn(),
        newHeader: 'newHeader',
      };
      const mockHeaders = vi.fn().mockReturnValue(mockHeadersMethods);
      vi.stubGlobal('Headers', mockHeaders);
      mockAuthTokenService.getToken.mockReturnValue(
        of({
          type: 'bearer',
          token: 'mockToken',
        })
      );
      service.intercept(mockUrl, mockOptions, mockHandle).subscribe();
      expect(mockHandle).toHaveBeenCalledWith(mockUrl, {
        ...mockOptions,
        headers: mockHeadersMethods,
      });
    });

    it('should call handle with default options if error has been occurred', () => {
      const headers = { param1: 'value1' };
      const mockUrl = 'mockUrl';
      const mockOptions = { body: 'value1', method: 'POST', headers };
      const mockHandle = vi.fn().mockReturnValue(of(null));
      mockAuthTokenService.getToken.mockReturnValue(
        throwError(() => new Error())
      );
      service.intercept(mockUrl, mockOptions, mockHandle).subscribe();
      expect(mockHandle).toHaveBeenCalledWith(mockUrl, mockOptions);
    });
  });

  describe('shouldInterceptRequest', () => {
    it('should check if base url exist', () => {
      expect(service.shouldInterceptRequest('url/additional')).toBe(true);
      mockConfig.baseUrl = 'url';
      expect(service.shouldInterceptRequest('url/additional')).toBe(true);
      expect(service.shouldInterceptRequest('noMatch/additional')).toBe(false);
    });
  });
});
