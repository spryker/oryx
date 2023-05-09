import { nextFrame } from '@open-wc/testing-helpers';
import { createInjector, destroyInjector, getInjector } from '@spryker-oryx/di';
import { of, throwError } from 'rxjs';
import { AuthTokenInterceptorConfig } from '../services';
import { OauthTokenInterceptor } from './oauth-token.interceptor';
import { OauthService } from './oauth.service';

const mockOauthService = {
  logout: vi.fn(),
  refreshToken: vi.fn(),
  getToken: vi.fn(),
};

const mockConfig: Record<string, string> = {
  headerName: 'mockHeaderName',
};

describe('OauthTokenInterceptor', () => {
  let service: OauthTokenInterceptor;

  beforeEach(() => {
    createInjector({
      providers: [
        {
          provide: AuthTokenInterceptorConfig,
          useValue: mockConfig,
        },
        {
          provide: OauthService,
          useValue: mockOauthService,
        },
        {
          provide: OauthTokenInterceptor,
          useClass: OauthTokenInterceptor,
        },
      ],
    });

    mockOauthService.getToken.mockReturnValue(of(null));
    service = getInjector().inject(OauthTokenInterceptor);
  });

  afterEach(() => {
    vi.resetAllMocks();
    vi.unstubAllGlobals();
    destroyInjector();
  });

  describe('intercept', () => {
    describe('header has X-Oauth key', () => {
      it('should remove `X-Oauth` call handle with params', () => {
        const mockHeadersMethods = {
          has: vi.fn().mockReturnValue(true),
          delete: vi.fn(),
          additional: 'mockAdditional',
        };
        const mockHeaders = vi.fn().mockReturnValue(mockHeadersMethods);
        vi.stubGlobal('Headers', mockHeaders);
        const mockUrl = 'mockUrl';
        const headers = { param1: 'value1' };
        const mockOptions = { body: 'value1', method: 'POST', headers };
        const mockHandle = vi.fn().mockReturnValue(of(null));

        service.intercept(mockUrl, mockOptions, mockHandle);

        expect(mockHeaders).toHaveBeenCalledWith(headers);
        expect(mockHeadersMethods.has).toHaveBeenCalledWith(
          OauthTokenInterceptor.HEADER_NAME
        );
        expect(mockHeadersMethods.delete).toHaveBeenCalledWith(
          OauthTokenInterceptor.HEADER_NAME
        );
        expect(mockHandle).toHaveBeenCalledWith(mockUrl, {
          ...mockOptions,
          headers: mockHeadersMethods,
        });
      });
    });

    it('should call refresh token', async () => {
      const mockHeadersMethods = {
        has: vi.fn(),
        delete: vi.fn(),
      };
      const mockHeaders = vi.fn().mockReturnValue(mockHeadersMethods);
      vi.stubGlobal('Headers', mockHeaders);
      const mockUrl = 'mockUrl';
      const headers = { param1: 'value1' };
      const mockOptions = { body: 'value1', method: 'POST', headers };
      const mockHandle = vi
        .fn()
        .mockReturnValueOnce(of({ ok: false, status: 401 }))
        .mockReturnValue(of({ ok: true }));
      mockOauthService.refreshToken.mockReturnValue(of(null));
      service.intercept(mockUrl, mockOptions, mockHandle).subscribe();
      await nextFrame();
      expect(mockOauthService.refreshToken).toHaveBeenCalled();
    });

    describe('when OauthService.refreshToken throw error', () => {
      it('should call logout', async () => {
        const mockHeadersMethods = {
          has: vi.fn(),
          delete: vi.fn(),
        };
        const mockHeaders = vi.fn().mockReturnValue(mockHeadersMethods);
        vi.stubGlobal('Headers', mockHeaders);
        const mockUrl = 'mockUrl';
        const headers = { param1: 'value1' };
        const mockOptions = { body: 'value1', method: 'POST', headers };
        const mockHandle = vi
          .fn()
          .mockReturnValueOnce(of({ ok: false, status: 401 }))
          .mockReturnValue(of({ ok: true }));
        mockOauthService.refreshToken.mockReturnValue(
          throwError(() => new Error())
        );
        mockOauthService.logout.mockReturnValue(of(null));
        service.intercept(mockUrl, mockOptions, mockHandle).subscribe();
        await nextFrame();
        expect(mockOauthService.logout).toHaveBeenCalled();
      });
    });
  });
});
