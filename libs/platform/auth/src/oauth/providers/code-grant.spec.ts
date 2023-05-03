import { nextFrame } from '@open-wc/testing-helpers';
import { StorageService } from '@spryker-oryx/core';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { catchError, of } from 'rxjs';
import {
  OauthCodeGrantProvider,
  OauthCodeGrantProviderConfig,
} from './code-grant';

const mockOauth = {
  generateRandomCodeVerifier: vi.fn(),
  calculatePKCECodeChallenge: vi.fn(),
  authorizationCodeGrantRequest: vi.fn(),
  parseWwwAuthenticateChallenges: vi.fn(),
  processAuthorizationCodeOAuth2Response: vi.fn(),
};

vi.mock('oauth4webapi', () => ({
  generateRandomCodeVerifier: () => mockOauth.generateRandomCodeVerifier(),
  calculatePKCECodeChallenge: () => mockOauth.calculatePKCECodeChallenge(),
  parseWwwAuthenticateChallenges: () =>
    mockOauth.parseWwwAuthenticateChallenges(),
  processAuthorizationCodeOAuth2Response: () =>
    mockOauth.processAuthorizationCodeOAuth2Response(),
  authorizationCodeGrantRequest: () =>
    mockOauth.authorizationCodeGrantRequest(),
}));

const mockStorage = {
  get: vi.fn(),
  set: vi.fn(),
  remove: vi.fn(),
};

const mockConfig: OauthCodeGrantProviderConfig = {
  grantType: 'authorization_code',
  authUrl: 'authUrl',
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

  afterEach(() => {
    vi.resetAllMocks();
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
      const service = setup();
      service.authenticate().subscribe();
      await nextFrame();
      expect(mockOauth.generateRandomCodeVerifier).toHaveBeenCalled();
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
