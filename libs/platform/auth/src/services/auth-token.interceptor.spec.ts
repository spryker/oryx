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
      const mockHeaders = {
        set: vi.fn(),
      };
      const mockRequestMethods = {
        clone: () => ({ headers: mockHeaders }),
      };
      const mockRequest = vi.fn().mockReturnValue(mockRequestMethods);
      vi.stubGlobal('Request', mockRequest);
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
          new Request('http://mockurl', {
            body: 'value1',
            method: 'POST',
            headers,
          }),
          mockHandle
        )
        .subscribe();
      expect(mockAuthTokenService.getToken).toHaveBeenCalled();
      expect(mockHeaders.set).toHaveBeenCalledWith(
        mockConfig.headerName,
        'Bearer mockToken'
      );
    });

    it('should not add new headers if token is not bearer type', () => {
      const mockHeaders = {
        set: vi.fn(),
      };
      const mockRequestMethods = {
        clone: () => ({ headers: mockHeaders }),
      };
      const mockRequest = vi.fn().mockReturnValue(mockRequestMethods);
      vi.stubGlobal('Request', mockRequest);
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
          new Request('http://mockurl', {
            body: 'value1',
            method: 'POST',
            headers,
          }),
          mockHandle
        )
        .subscribe();
      expect(mockHeaders.set).not.toHaveBeenCalled();
    });

    it('should call handle with options with generated headers', () => {
      const headers = { param1: 'value1' };
      const mockUrl = 'mockUrl';
      const mockOptions = { body: 'value1', method: 'POST', headers };
      const mockHandle = vi.fn().mockReturnValue(of(null));
      const mockHeaders = {
        set: vi.fn(),
      };
      const mockRequestMethods = {
        clone: () => ({ headers: mockHeaders }),
      };
      const mockRequest = vi.fn().mockReturnValue(mockRequestMethods);
      vi.stubGlobal('Request', mockRequest);
      mockAuthTokenService.getToken.mockReturnValue(
        of({
          type: 'bearer',
          token: 'mockToken',
        })
      );
      service
        .intercept(new Request(mockUrl, mockOptions), mockHandle)
        .subscribe();
      expect(mockHandle).toHaveBeenCalledWith({ headers: mockHeaders });
    });

    it('should call handle with default options if error has been occurred', () => {
      const headers = { param1: 'value1' };
      const mockUrl = 'http://mockurl';
      const mockOptions = { body: 'value1', method: 'POST', headers };
      const mockHandle = vi.fn().mockReturnValue(of(null));
      mockAuthTokenService.getToken.mockReturnValue(
        throwError(() => new Error())
      );
      const req = new Request(mockUrl, mockOptions);
      service.intercept(req, mockHandle).subscribe();
      expect(mockHandle).toHaveBeenCalledWith(req);
    });
  });

  describe('shouldInterceptRequest', () => {
    it('should check if base url exist', () => {
      expect(
        service.shouldInterceptRequest(new Request('http://url/additional'))
      ).toBe(true);
      mockConfig.baseUrl = 'http://url';
      service.shouldInterceptRequest(new Request('http://url/additional'));
      expect(
        service.shouldInterceptRequest(new Request('http://url/additional'))
      ).toBe(true);
      expect(
        service.shouldInterceptRequest(new Request('http://noMatch/additional'))
      ).toBe(false);
    });
  });
});
