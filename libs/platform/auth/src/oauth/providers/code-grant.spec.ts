import { nextFrame } from '@open-wc/testing-helpers';
import { StorageService } from '@spryker-oryx/core';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { skipStateCheck } from 'oauth4webapi';
import { catchError, of } from 'rxjs';
import {
  OauthCodeGrantPKCEMethod,
  OauthCodeGrantProvider,
  OauthCodeGrantProviderConfig,
} from './code-grant';

const mockOauth = {
  generateRandomCodeVerifier: vi.fn(),
  calculatePKCECodeChallenge: vi.fn(),
  authorizationCodeGrantRequest: vi.fn(),
  parseWwwAuthenticateChallenges: vi.fn(),
  processAuthorizationCodeOAuth2Response: vi.fn(),
  validateAuthResponse: vi.fn(),
  isOAuth2Error: vi.fn(),
  refreshTokenGrantRequest: vi.fn(),
  processRefreshTokenResponse: vi.fn(),
  revocationRequest: vi.fn(),
  processRevocationResponse: vi.fn(),
};

vi.mock('oauth4webapi', async () => ({
  ...((await vi.importActual('oauth4webapi')) as Record<string, unknown>),
  generateRandomCodeVerifier: () => mockOauth.generateRandomCodeVerifier(),
  calculatePKCECodeChallenge: (data: unknown) =>
    mockOauth.calculatePKCECodeChallenge(data),
  parseWwwAuthenticateChallenges: (data: unknown) =>
    mockOauth.parseWwwAuthenticateChallenges(data),
  processAuthorizationCodeOAuth2Response: (...data: unknown[]) =>
    mockOauth.processAuthorizationCodeOAuth2Response(...data),
  authorizationCodeGrantRequest: (...data: unknown[]) =>
    mockOauth.authorizationCodeGrantRequest(...data),
  validateAuthResponse: (...data: unknown[]) =>
    mockOauth.validateAuthResponse(...data),
  refreshTokenGrantRequest: (...data: unknown[]) =>
    mockOauth.refreshTokenGrantRequest(...data),
  processRefreshTokenResponse: (...data: unknown[]) =>
    mockOauth.processRefreshTokenResponse(...data),
  revocationRequest: (...data: unknown[]) =>
    mockOauth.revocationRequest(...data),
  isOAuth2Error: (data: unknown) => mockOauth.isOAuth2Error(data),
  processRevocationResponse: (data: unknown) =>
    mockOauth.processRevocationResponse(data),
}));

const mockStorage = {
  get: vi.fn(),
  set: vi.fn(),
  remove: vi.fn(),
};

const mockConfig: OauthCodeGrantProviderConfig = {
  grantType: 'authorization_code',
  authUrl: 'https://mock-url.com',
  redirectUrl: 'redirectUrl',
  tokenUrl: 'tokenUrl',
  id: 'id',
  clientId: 'clientId',
};

const callback = vi.fn();

describe('OauthPasswordGrantProvider', () => {
  const setup = (config = mockConfig) => {
    const testInjector = createInjector({
      providers: [
        {
          provide: StorageService,
          useValue: mockStorage,
        },
        {
          provide: OauthCodeGrantProvider,
          useFactory: () => new OauthCodeGrantProvider(config),
        },
      ],
    });

    return testInjector.inject(OauthCodeGrantProvider);
  };

  beforeEach(() => {
    vi.stubGlobal('location', { assign: vi.fn() });
  });

  afterEach(() => {
    vi.resetAllMocks();
    vi.unstubAllGlobals();
    destroyInjector();
  });

  describe('authenticate', () => {
    it('should throw error if token exists', async () => {
      mockStorage.get.mockReturnValue(of({ state: 'authenticated' }));
      const service = setup();
      service
        .authenticate()
        .pipe(catchError((error) => of(callback(error))))
        .subscribe();
      await nextFrame();
      expect(callback).toHaveBeenCalledWith(
        new Error('Already authenticated!')
      );
    });

    it('should generate PKCE if pkceMethod is OauthCodeGrantPKCEMethod.S256', async () => {
      mockStorage.get.mockReturnValue(of({ state: 'non-authenticated' }));
      mockStorage.set.mockReturnValue(of(null));
      mockOauth.generateRandomCodeVerifier.mockReturnValue('verifier');
      const service = setup({
        ...mockConfig,
        pkceMethod: OauthCodeGrantPKCEMethod.S256,
      });
      service.authenticate().subscribe();
      await nextFrame();
      expect(mockOauth.generateRandomCodeVerifier).toHaveBeenCalled();
      expect(mockOauth.calculatePKCECodeChallenge).toHaveBeenCalledWith(
        'verifier'
      );
    });

    it('should generate PKCE if pkceMethod is OauthCodeGrantPKCEMethod.Plain', async () => {
      mockStorage.get.mockReturnValue(of({ state: 'non-authenticated' }));
      mockStorage.set.mockReturnValue(of(null));
      const service = setup({
        ...mockConfig,
        pkceMethod: OauthCodeGrantPKCEMethod.Plain,
      });
      service.authenticate().subscribe();
      await nextFrame();
      expect(mockOauth.generateRandomCodeVerifier).toHaveBeenCalled();
      expect(mockOauth.calculatePKCECodeChallenge).not.toHaveBeenCalled();
    });

    it('should generate proper authUrl', async () => {
      const mockUrl = {
        searchParams: {
          set: vi.fn(),
        },
      };
      mockStorage.get.mockReturnValue(of({ state: 'non-authenticated' }));
      mockStorage.set.mockReturnValue(of(null));
      mockOauth.generateRandomCodeVerifier.mockReturnValue('AcodeVerifier');
      const mockSearchConstructor = vi.fn().mockReturnValue(mockUrl);
      vi.stubGlobal('URL', mockSearchConstructor);
      const service = setup({
        ...mockConfig,
        pkceMethod: OauthCodeGrantPKCEMethod.Plain,
        scope: 'configScope',
      });
      service.authenticate({ scope: 'requestScope' }).subscribe();
      await nextFrame();
      expect(mockSearchConstructor).toHaveBeenCalledWith(mockConfig.authUrl);
      expect(mockUrl.searchParams.set).toHaveBeenNthCalledWith(
        1,
        'client_id',
        mockConfig.clientId
      );
      expect(mockUrl.searchParams.set).toHaveBeenNthCalledWith(
        2,
        'response_type',
        'code'
      );
      expect(mockUrl.searchParams.set).toHaveBeenNthCalledWith(
        3,
        'redirect_uri',
        mockConfig.redirectUrl
      );
      expect(mockUrl.searchParams.set).toHaveBeenNthCalledWith(
        4,
        'scope',
        'requestScope configScope'
      );
      expect(mockUrl.searchParams.set).toHaveBeenNthCalledWith(
        5,
        'code_challenge',
        'AcodeVerifier'
      );
      expect(mockUrl.searchParams.set).toHaveBeenNthCalledWith(
        6,
        'code_challenge_method',
        'plain'
      );
    });

    it('should set new token to storage', async () => {
      mockStorage.get.mockReturnValue(of({ state: 'non-authenticated' }));
      mockStorage.set.mockReturnValue(of(null));
      mockOauth.generateRandomCodeVerifier.mockReturnValue('AcodeVerifier');
      const service = setup(mockConfig);
      service.authenticate().subscribe();
      await nextFrame();
      expect(mockStorage.set).toHaveBeenCalledWith('oryx.oauth-token', {
        codeVerifier: 'AcodeVerifier',
        providerId: 'id',
        state: 'authenticating',
      });
    });

    it('should redirect to proper url', async () => {
      mockStorage.get.mockReturnValue(of({ state: 'non-authenticated' }));
      mockStorage.set.mockReturnValue(of(null));
      mockOauth.generateRandomCodeVerifier.mockReturnValue('AcodeVerifier');
      const service = setup({
        ...mockConfig,
        pkceMethod: OauthCodeGrantPKCEMethod.Plain,
      });
      service.authenticate().subscribe();
      await nextFrame();
      expect(globalThis.location.href).toBe(
        `${mockConfig.authUrl}/?client_id=${mockConfig.clientId}&response_type=code&redirect_uri=${mockConfig.redirectUrl}&code_challenge=AcodeVerifier&code_challenge_method=plain`
      );
    });
  });

  describe('handleCallback', () => {
    it('should throw error if token is not `authenticating`', async () => {
      mockStorage.get.mockReturnValue(of({ state: 'authenticated' }));
      const service = setup();
      service
        .handleCallback(new URL(mockConfig.authUrl))
        .pipe(catchError((error) => of(callback(error))))
        .subscribe();
      await nextFrame();
      expect(callback).toHaveBeenCalledWith(new Error('Invalid Oauth state!'));
    });

    it('should validate auth response', async () => {
      mockOauth.isOAuth2Error.mockReturnValue(false);
      mockOauth.authorizationCodeGrantRequest.mockReturnValue(of(''));
      mockStorage.get.mockReturnValue(of({ state: 'authenticating' }));
      mockStorage.set.mockReturnValue(of(null));
      const mockSearchConstructor = vi
        .fn()
        .mockReturnValue({ hostname: 'mockHostname' });
      vi.stubGlobal('URL', mockSearchConstructor);
      const service = setup();
      service.handleCallback('callbackUrl' as unknown as URL).subscribe();
      await nextFrame();
      const authServer = {
        issuer: 'mockHostname',
        authorization_endpoint: mockConfig.authUrl,
        token_endpoint: mockConfig.tokenUrl,
        revocation_endpoint: mockConfig.revocationUrl,
      };
      const clientId = {
        client_id: mockConfig.clientId,
        token_endpoint_auth_method: 'none',
      };
      expect(mockSearchConstructor).toHaveBeenCalledWith(mockConfig.authUrl);
      expect(mockOauth.validateAuthResponse).toHaveBeenCalledWith(
        authServer,
        clientId,
        'callbackUrl',
        skipStateCheck
      );
    });

    it('should throw error if auth response is incorrect', async () => {
      mockOauth.isOAuth2Error.mockReturnValue(true);
      mockOauth.validateAuthResponse.mockReturnValue('InvalidAuthResponse');
      mockStorage.get.mockReturnValue(of({ state: 'authenticating' }));
      const mockSearchConstructor = vi
        .fn()
        .mockReturnValue({ hostname: 'mockHostname' });
      vi.stubGlobal('URL', mockSearchConstructor);
      const service = setup();
      service
        .handleCallback(new URL(mockConfig.authUrl))
        .pipe(catchError((error) => of(callback(error))))
        .subscribe();
      await nextFrame();
      expect(callback).toHaveBeenCalledWith(
        new Error('Oauth token request error: InvalidAuthResponse')
      );
    });

    it('should call authorizationCodeGrantRequest if auth response is correct', async () => {
      mockOauth.isOAuth2Error.mockReturnValue(false);
      mockOauth.authorizationCodeGrantRequest.mockReturnValue(of(''));
      mockOauth.validateAuthResponse.mockReturnValue('ValidAuthResponse');
      mockStorage.get.mockReturnValue(
        of({ state: 'authenticating', codeVerifier: 'mockCodeVerifier' })
      );
      mockStorage.set.mockReturnValue(of(null));
      const mockSearchConstructor = vi
        .fn()
        .mockReturnValue({ hostname: 'mockHostname' });
      vi.stubGlobal('URL', mockSearchConstructor);
      const service = setup();
      service.handleCallback('callbackUrl' as unknown as URL).subscribe();
      await nextFrame();
      const authServer = {
        issuer: 'mockHostname',
        authorization_endpoint: mockConfig.authUrl,
        token_endpoint: mockConfig.tokenUrl,
        revocation_endpoint: mockConfig.revocationUrl,
      };
      const clientId = {
        client_id: mockConfig.clientId,
        token_endpoint_auth_method: 'none',
      };
      expect(mockOauth.authorizationCodeGrantRequest).toHaveBeenCalledWith(
        authServer,
        clientId,
        'ValidAuthResponse',
        mockConfig.redirectUrl,
        'mockCodeVerifier'
      );
    });

    it('should call parseWwwAuthenticateChallenges with proper response', async () => {
      mockOauth.isOAuth2Error.mockReturnValue(false);
      mockOauth.authorizationCodeGrantRequest.mockReturnValue(
        of('mockCodeGrantResponse')
      );
      mockStorage.get.mockReturnValue(of({ state: 'authenticating' }));
      mockStorage.set.mockReturnValue(of(null));
      const service = setup();
      service.handleCallback(new URL(mockConfig.authUrl)).subscribe();
      await nextFrame();
      expect(mockOauth.parseWwwAuthenticateChallenges).toHaveBeenCalledWith(
        'mockCodeGrantResponse'
      );
    });

    it('should throw error if authentication has challenges', async () => {
      mockOauth.isOAuth2Error.mockReturnValue(false);
      mockOauth.authorizationCodeGrantRequest.mockReturnValue(
        of('mockCodeGrantResponse')
      );
      mockOauth.parseWwwAuthenticateChallenges.mockReturnValue(true);
      mockStorage.get.mockReturnValue(of({ state: 'authenticating' }));
      mockStorage.set.mockReturnValue(of(null));
      const service = setup();
      service
        .handleCallback(new URL(mockConfig.authUrl))
        .pipe(catchError((error) => of(callback(error))))
        .subscribe();
      await nextFrame();
      expect(callback).toHaveBeenCalledWith(
        new Error('Oauth www-authenticate challenges are not supported!')
      );
    });

    it('should call processAuthorizationCodeOAuth2Response with proper params', async () => {
      mockOauth.isOAuth2Error.mockReturnValue(false);
      mockOauth.authorizationCodeGrantRequest.mockReturnValue(
        of('mockCodeGrantResponse')
      );
      mockStorage.get.mockReturnValue(
        of({ state: 'authenticating', codeVerifier: 'mockCodeVerifier' })
      );
      mockStorage.set.mockReturnValue(of(null));
      const mockSearchConstructor = vi
        .fn()
        .mockReturnValue({ hostname: 'mockHostname' });
      vi.stubGlobal('URL', mockSearchConstructor);
      const service = setup();
      service.handleCallback('callbackUrl' as unknown as URL).subscribe();
      await nextFrame();
      const authServer = {
        issuer: 'mockHostname',
        authorization_endpoint: mockConfig.authUrl,
        token_endpoint: mockConfig.tokenUrl,
        revocation_endpoint: mockConfig.revocationUrl,
      };
      const clientId = {
        client_id: mockConfig.clientId,
        token_endpoint_auth_method: 'none',
      };
      expect(
        mockOauth.processAuthorizationCodeOAuth2Response
      ).toHaveBeenCalledWith(authServer, clientId, 'mockCodeGrantResponse');
    });

    it('should throw error if authentication has challenges', async () => {
      mockOauth.isOAuth2Error.mockImplementation(
        (data) => data === 'CodeOAuth2Response'
      );
      mockOauth.authorizationCodeGrantRequest.mockReturnValue(
        of('mockCodeGrantResponse')
      );
      mockOauth.processAuthorizationCodeOAuth2Response.mockReturnValue(
        'CodeOAuth2Response'
      );
      mockStorage.get.mockReturnValue(of({ state: 'authenticating' }));
      mockStorage.set.mockReturnValue(of(null));
      const service = setup();
      service
        .handleCallback(new URL(mockConfig.authUrl))
        .pipe(catchError((error) => of(callback(error))))
        .subscribe();
      await nextFrame();
      expect(callback).toHaveBeenCalledWith(
        new Error('Oauth token response error: CodeOAuth2Response')
      );
    });

    it('should set new token to storage', async () => {
      mockOauth.isOAuth2Error.mockReturnValue(false);
      mockOauth.authorizationCodeGrantRequest.mockReturnValue(of(null));
      mockOauth.processAuthorizationCodeOAuth2Response.mockReturnValue(
        'CodeOAuth2Response'
      );
      mockStorage.get.mockReturnValue(of({ state: 'authenticating' }));
      mockStorage.set.mockReturnValue(of(null));
      const service = setup();
      service.handleCallback(new URL(mockConfig.authUrl)).subscribe();
      await nextFrame();
      expect(mockStorage.set).toHaveBeenCalledWith('oryx.oauth-token', {
        state: 'authenticated',
        token: 'CodeOAuth2Response',
      });
    });
  });

  describe('revoke', () => {
    // Temporary solution: do not remove token from storage, create new one instead
    // it('should remove token from storage if config has not `revocationUrl`', async () => {
    //   mockStorage.get.mockReturnValue(of(null));
    //   mockStorage.remove.mockReturnValue(of(null));
    //   const service = setup();
    //   service.revoke().subscribe();
    //   await nextFrame();
    //   expect(mockStorage.remove).toHaveBeenCalledWith('oryx.oauth-token');
    // });

    it('should throw error if token is not `authenticated`', async () => {
      mockStorage.get.mockReturnValue(of({ state: 'authenticating' }));
      const service = setup({
        ...mockConfig,
        revocationUrl: 'mockRevocationUrl',
      });
      service
        .revoke()
        .pipe(catchError((error) => of(callback(error))))
        .subscribe();
      await nextFrame();
      expect(callback).toHaveBeenCalledWith(new Error('Invalid Oauth state!'));
    });

    it('should call refreshTokenGrantRequest with proper params', async () => {
      mockStorage.get.mockReturnValue(
        of({
          state: 'authenticated',
          token: { access_token: 'mock_access_token' },
        })
      );
      mockStorage.remove.mockReturnValue(of(null));
      mockOauth.revocationRequest.mockReturnValue(of(''));
      mockOauth.processRevocationResponse.mockReturnValue(of(''));
      const mockSearchConstructor = vi
        .fn()
        .mockReturnValue({ hostname: 'mockHostname' });
      const mockUrlSearchConstructor = vi.fn();
      vi.stubGlobal('URL', mockSearchConstructor);
      vi.stubGlobal('URLSearchParams', mockUrlSearchConstructor);
      const service = setup({
        ...mockConfig,
        revocationUrl: 'mockRevocationUrl',
      });
      service.revoke().subscribe();
      await nextFrame();
      const authServer = {
        issuer: 'mockHostname',
        authorization_endpoint: mockConfig.authUrl,
        token_endpoint: mockConfig.tokenUrl,
        revocation_endpoint: 'mockRevocationUrl',
      };
      const clientId = {
        client_id: mockConfig.clientId,
        token_endpoint_auth_method: 'none',
      };
      expect(mockUrlSearchConstructor).toHaveBeenCalledWith({
        token_type_hint: 'access_token',
      });
      expect(mockOauth.revocationRequest).toHaveBeenCalledWith(
        authServer,
        clientId,
        'mock_access_token',
        {
          additionalParameters: expect.anything(),
        }
      );
    });

    it('should call processRevocationResponse with proper response', async () => {
      mockStorage.get.mockReturnValue(
        of({
          state: 'authenticated',
          token: { access_token: 'mock_access_token' },
        })
      );
      mockStorage.remove.mockReturnValue(of(null));
      mockOauth.revocationRequest.mockReturnValue(of('mockRevocationResponse'));
      mockOauth.processRevocationResponse.mockReturnValue(of(''));
      const service = setup({
        ...mockConfig,
        revocationUrl: 'mockRevocationUrl',
      });
      service.revoke().subscribe();
      await nextFrame();
      expect(mockOauth.processRevocationResponse).toHaveBeenCalledWith(
        'mockRevocationResponse'
      );
    });

    it('should throw error if processRevocationResponse is incorrect', async () => {
      mockStorage.get.mockReturnValue(
        of({
          state: 'authenticated',
          token: { access_token: 'mock_access_token' },
        })
      );
      mockStorage.remove.mockReturnValue(of(null));
      mockOauth.revocationRequest.mockReturnValue('mockRevocationResponse');
      mockOauth.processRevocationResponse.mockReturnValue(
        'mockRevocationToken'
      );
      mockOauth.isOAuth2Error.mockReturnValue(true);
      const service = setup({
        ...mockConfig,
        revocationUrl: 'mockRevocationUrl',
      });
      service
        .revoke()
        .pipe(catchError((error) => of(callback(error))))
        .subscribe();
      await nextFrame();
      expect(callback).toHaveBeenCalledWith(
        new Error('Oauth token revocation error: mockRevocationToken')
      );
    });

    it('should remove token from storage', async () => {
      mockStorage.get.mockReturnValue(
        of({
          state: 'authenticated',
          token: { access_token: 'mock_access_token' },
        })
      );
      mockStorage.remove.mockReturnValue(of(null));
      mockOauth.revocationRequest.mockReturnValue('mockRevocationResponse');
      mockOauth.processRevocationResponse.mockReturnValue(
        'mockRevocationToken'
      );
      const service = setup({
        ...mockConfig,
        revocationUrl: 'mockRevocationUrl',
      });
      service.revoke().subscribe();
      await nextFrame();
      expect(mockStorage.remove).toHaveBeenCalledWith('oryx.oauth-token');
    });
  });

  describe('refreshToken', () => {
    it('should throw error if token is not `authenticated`', async () => {
      mockStorage.get.mockReturnValue(of({ state: 'authenticating' }));
      const service = setup();
      service
        .refreshToken()
        .pipe(catchError((error) => of(callback(error))))
        .subscribe();
      await nextFrame();
      expect(callback).toHaveBeenCalledWith(new Error('Invalid Oauth state!'));
    });

    it('should throw error if saved token has not `refresh_token`', async () => {
      mockStorage.get.mockReturnValue(
        of({ state: 'authenticated', token: {} })
      );
      const service = setup();
      service
        .refreshToken()
        .pipe(catchError((error) => of(callback(error))))
        .subscribe();
      await nextFrame();
      expect(callback).toHaveBeenCalledWith(
        new Error(
          'Oauth server does not support token refresh! Use login instead!'
        )
      );
    });

    it('should call refreshTokenGrantRequest with proper params', async () => {
      mockStorage.get.mockReturnValue(
        of({
          state: 'authenticated',
          token: { refresh_token: 'mock_refresh_token' },
        })
      );
      mockStorage.set.mockReturnValue(of(null));
      mockOauth.refreshTokenGrantRequest.mockReturnValue(of(''));
      mockOauth.processRefreshTokenResponse.mockReturnValue(of(''));
      const mockSearchConstructor = vi
        .fn()
        .mockReturnValue({ hostname: 'mockHostname' });
      vi.stubGlobal('URL', mockSearchConstructor);
      const service = setup();
      service.refreshToken().subscribe();
      await nextFrame();
      const authServer = {
        issuer: 'mockHostname',
        authorization_endpoint: mockConfig.authUrl,
        token_endpoint: mockConfig.tokenUrl,
        revocation_endpoint: mockConfig.revocationUrl,
      };
      const clientId = {
        client_id: mockConfig.clientId,
        token_endpoint_auth_method: 'none',
      };
      expect(mockOauth.refreshTokenGrantRequest).toHaveBeenCalledWith(
        authServer,
        clientId,
        'mock_refresh_token'
      );
    });

    it('should call processRefreshTokenResponse with proper params', async () => {
      mockStorage.get.mockReturnValue(
        of({
          state: 'authenticated',
          token: { refresh_token: 'mock_refresh_token' },
        })
      );
      mockStorage.set.mockReturnValue(of(null));
      mockOauth.refreshTokenGrantRequest.mockReturnValue(
        of('mockRefreshTokenGrantResponse')
      );
      mockOauth.processRefreshTokenResponse.mockReturnValue(of(''));
      const mockSearchConstructor = vi
        .fn()
        .mockReturnValue({ hostname: 'mockHostname' });
      vi.stubGlobal('URL', mockSearchConstructor);
      const service = setup();
      service.refreshToken().subscribe();
      await nextFrame();
      const authServer = {
        issuer: 'mockHostname',
        authorization_endpoint: mockConfig.authUrl,
        token_endpoint: mockConfig.tokenUrl,
        revocation_endpoint: mockConfig.revocationUrl,
      };
      const clientId = {
        client_id: mockConfig.clientId,
        token_endpoint_auth_method: 'none',
      };
      expect(mockOauth.processRefreshTokenResponse).toHaveBeenCalledWith(
        authServer,
        clientId,
        'mockRefreshTokenGrantResponse'
      );
    });

    it('should throw error if processRefreshTokenResponse is incorrect', async () => {
      mockStorage.get.mockReturnValue(
        of({
          state: 'authenticated',
          token: { refresh_token: 'mock_refresh_token' },
        })
      );
      mockStorage.set.mockReturnValue(of(null));
      mockOauth.isOAuth2Error.mockReturnValue(true);
      mockOauth.refreshTokenGrantRequest.mockReturnValue(of(''));
      mockOauth.processRefreshTokenResponse.mockReturnValue('mockRefreshToken');
      const service = setup();
      service
        .refreshToken()
        .pipe(catchError((error) => of(callback(error))))
        .subscribe();
      await nextFrame();
      expect(callback).toHaveBeenCalledWith(
        new Error('Oauth token refresh error: mockRefreshToken')
      );
    });

    it('should set new token into storage', async () => {
      mockStorage.get.mockReturnValue(
        of({
          state: 'authenticated',
          token: { refresh_token: 'mock_refresh_token' },
        })
      );
      mockStorage.set.mockReturnValue(of(null));
      mockOauth.refreshTokenGrantRequest.mockReturnValue(of(''));
      mockOauth.processRefreshTokenResponse.mockReturnValue('mockRefreshToken');
      const service = setup();
      service.refreshToken().subscribe();
      await nextFrame();
      expect(mockStorage.set).toHaveBeenCalledWith('oryx.oauth-token', {
        state: 'authenticated',
        token: 'mockRefreshToken',
      });
    });
  });

  describe('getToken', () => {
    it('should return token', async () => {
      mockStorage.get.mockReturnValue(
        of({
          state: 'authenticated',
          token: 'codeToken',
        })
      );
      const service = setup();
      service.getToken().subscribe(callback);
      await nextFrame();
      expect(mockStorage.get).toHaveBeenCalledWith('oryx.oauth-token');
      expect(callback).toHaveBeenCalledWith('codeToken');
    });

    it('should throw error if token is not exist', async () => {
      mockStorage.get.mockReturnValue(of(null));
      const service = setup();
      service
        .getToken()
        .pipe(catchError((error) => of(callback(error))))
        .subscribe();
      await nextFrame();
      expect(mockStorage.get).toHaveBeenCalledWith('oryx.oauth-token');
      expect(callback).toHaveBeenCalledWith(new Error('Not authenticated!'));
    });
  });
});
