import { StorageService } from '@spryker-oryx/core';
import { createInjector, destroyInjector, getInjector } from '@spryker-oryx/di';
import { RouterService } from '@spryker-oryx/router';
import { BehaviorSubject, catchError, of } from 'rxjs';
import { OauthService, OauthServiceConfig } from './oauth.service';
import { OauthProviderFactoryService } from './provider-factory.service';

const mockConfig = (id: string) => ({
  access_token: `mock_access_token${id}`,
  token_type: `mock_token_type${id}`,
});

const mockOauthServiceConfig = {
  loginRoute: 'mockLoginRoute',
  providers: [
    {
      id: 'a',
      revoke: vi.fn(),
      handleCallback: vi.fn(),
      authenticate: vi.fn(),
      getToken: vi.fn(),
      refreshToken: vi.fn(),
    },
    {
      id: 'b',
      revoke: vi.fn(),
      handleCallback: vi.fn(),
      authenticate: vi.fn(),
      getToken: vi.fn(),
      refreshToken: vi.fn(),
    },
  ],
};

const mockOauthProviderFactoryService = {
  create: vi.fn(),
};

const mockRouterService = {
  navigate: vi.fn(),
};

const mockStorageService = {
  get: vi.fn(),
  set: vi.fn(),
};

const callback = vi.fn();
let storageTokenTrigger = new BehaviorSubject<unknown>(null);

describe('OauthService', () => {
  const providers = [
    {
      provide: OauthServiceConfig,
      useValue: mockOauthServiceConfig,
    },
    {
      provide: OauthProviderFactoryService,
      useValue: mockOauthProviderFactoryService,
    },
    {
      provide: RouterService,
      useValue: mockRouterService,
    },
    {
      provide: StorageService,
      useValue: mockStorageService,
    },
    {
      provide: OauthService,
      useClass: OauthService,
    },
  ];

  const getService = () => getInjector().inject(OauthService);

  beforeEach(() => {
    createInjector({ providers });

    mockStorageService.set.mockReturnValue(of(null));
    mockStorageService.get.mockReturnValue(storageTokenTrigger);
    mockOauthProviderFactoryService.create.mockImplementation((config) =>
      of(config)
    );
  });

  afterEach(() => {
    storageTokenTrigger = new BehaviorSubject<unknown>(null);
    vi.resetAllMocks();
    vi.unstubAllGlobals();
    destroyInjector();
  });

  describe('isAuthenticated', () => {
    it('should get token from storage and providers by id', () => {
      mockOauthServiceConfig.providers[0].getToken.mockReturnValue(
        of(mockConfig('A'))
      );
      getService().isAuthenticated().subscribe(callback);
      expect(mockStorageService.get).toHaveBeenCalledWith('oryx.oauth-state');
      expect(callback).toHaveBeenCalledWith(false);
      storageTokenTrigger.next({ authorizedBy: 'a' });
      expect(mockOauthProviderFactoryService.create).toHaveBeenCalledWith(
        mockOauthServiceConfig.providers[0]
      );
      expect(mockOauthServiceConfig.providers[0].getToken).toHaveBeenCalled();
      expect(callback).toHaveBeenCalledWith(true);
    });
  });

  describe('getOauthToken', () => {
    it('should throw error with incorrect provider', () => {
      storageTokenTrigger.next({ authorizedBy: 'c' });
      getService()
        .getOauthToken()
        .pipe(catchError((error) => of(callback(error))))
        .subscribe();
      expect(callback).toHaveBeenCalledWith(
        new Error(`OauthService: Unknown Oauth provider ID 'c'!`)
      );
    });

    it('should return token from provider', () => {
      storageTokenTrigger.next({ authorizedBy: 'a' });
      mockOauthServiceConfig.providers[0].getToken.mockReturnValue(
        of(mockConfig('A'))
      );
      mockOauthServiceConfig.providers[1].getToken.mockReturnValue(
        of(mockConfig('B'))
      );
      getService().getOauthToken().subscribe(callback);
      expect(callback).toHaveBeenCalledWith(mockConfig('A'));
      storageTokenTrigger.next({ authorizedBy: 'b' });
      expect(callback).toHaveBeenCalledWith(mockConfig('B'));
    });

    it('should throw error if `authorizedBy` is not specified', () => {
      storageTokenTrigger.next(null);
      getService()
        .getOauthToken()
        .pipe(catchError((error) => of(callback(error))))
        .subscribe();
      expect(callback).toHaveBeenCalledWith(
        new Error('OauthService: Not authenticated!')
      );
    });
  });

  describe('getToken', () => {
    it('should return transformed token from provider', () => {
      storageTokenTrigger.next({ authorizedBy: 'a' });
      mockOauthServiceConfig.providers[0].getToken.mockReturnValue(
        of(mockConfig('A'))
      );
      mockOauthServiceConfig.providers[1].getToken.mockReturnValue(
        of(mockConfig('B'))
      );
      getService().getToken().subscribe(callback);
      expect(callback).toHaveBeenCalledWith({
        token: mockConfig('A').access_token,
        type: mockConfig('A').token_type,
      });
      storageTokenTrigger.next({ authorizedBy: 'b' });
      expect(callback).toHaveBeenCalledWith({
        token: mockConfig('B').access_token,
        type: mockConfig('B').token_type,
      });
    });
  });

  describe('refreshToken', () => {
    it('should call refreshToken function from appropriate provider', () => {
      storageTokenTrigger.next({ authorizedBy: 'a' });
      mockOauthServiceConfig.providers[0].getToken.mockReturnValue(
        of(mockConfig('A'))
      );
      mockOauthServiceConfig.providers[1].getToken.mockReturnValue(
        of(mockConfig('B'))
      );
      mockOauthServiceConfig.providers[0].refreshToken(of('a'));
      mockOauthServiceConfig.providers[1].refreshToken(of('b'));
      getService().refreshToken().subscribe();
      expect(
        mockOauthServiceConfig.providers[0].refreshToken
      ).toHaveBeenCalled();
      storageTokenTrigger.next({ authorizedBy: 'b' });
      expect(
        mockOauthServiceConfig.providers[1].refreshToken
      ).toHaveBeenCalled();
    });
  });

  describe('when invokeStoredToken is called', () => {
    it('should call storage service', () => {
      getService().invokeStoredToken();
      expect(mockStorageService.get).toHaveBeenCalledWith('oryx.oauth-state');
    });
  });

  describe('logout', () => {
    it('should call revoke function from appropriate provider', () => {
      storageTokenTrigger.next({ authorizedBy: 'a' });
      mockOauthServiceConfig.providers[0].getToken.mockReturnValue(
        of(mockConfig('A'))
      );
      mockOauthServiceConfig.providers[1].getToken.mockReturnValue(
        of(mockConfig('B'))
      );
      mockOauthServiceConfig.providers[0].revoke(of('a'));
      mockOauthServiceConfig.providers[1].revoke(of('b'));
      getService().logout().subscribe();
      expect(mockOauthServiceConfig.providers[0].revoke).toHaveBeenCalled();
      storageTokenTrigger.next({ authorizedBy: 'b' });
      expect(mockOauthServiceConfig.providers[1].revoke).toHaveBeenCalled();
    });

    it('should set empty object to storage', () => {
      storageTokenTrigger.next({ authorizedBy: 'a' });
      mockOauthServiceConfig.providers[0].getToken.mockReturnValue(
        of(mockConfig('A'))
      );
      mockOauthServiceConfig.providers[0].revoke(of('a'));
      getService().logout().subscribe();
      expect(mockStorageService.set).toHaveBeenCalledWith(
        'oryx.oauth-state',
        {}
      );
    });
  });

  describe('loginWith', () => {
    it('should call authenticate function from appropriate provider', () => {
      mockOauthServiceConfig.providers[0].authenticate.mockReturnValue(of('a'));
      mockOauthServiceConfig.providers[1].authenticate.mockReturnValue(of('b'));
      const mockRequest = { request: 'mockRequest' };
      getService().loginWith('a', mockRequest);
      expect(
        mockOauthServiceConfig.providers[0].authenticate
      ).toHaveBeenCalledWith(mockRequest);
      getService().loginWith('b', mockRequest);
      expect(
        mockOauthServiceConfig.providers[1].authenticate
      ).toHaveBeenCalledWith(mockRequest);
    });

    it('should set proper object to storage', () => {
      mockOauthServiceConfig.providers[0].authenticate.mockReturnValue(of('a'));
      mockStorageService.set.mockReturnValue(of(null));
      getService().loginWith('a', {});
      expect(mockStorageService.set).toHaveBeenCalledWith('oryx.oauth-state', {
        authorizedBy: 'a',
      });
    });
  });

  describe('handleCallback', () => {
    it('should call handleCallback function from appropriate provider', () => {
      mockOauthServiceConfig.providers[0].handleCallback.mockReturnValue(
        of('a')
      );
      mockOauthServiceConfig.providers[1].handleCallback.mockReturnValue(
        of('b')
      );
      getService().handleCallback('a');
      expect(
        mockOauthServiceConfig.providers[0].handleCallback
      ).toHaveBeenCalled();
      getService().handleCallback('b');
      expect(
        mockOauthServiceConfig.providers[1].handleCallback
      ).toHaveBeenCalled();
    });

    it('should set proper object to storage', () => {
      mockOauthServiceConfig.providers[0].handleCallback.mockReturnValue(
        of('a')
      );
      mockStorageService.set.mockReturnValue(of(null));
      getService().handleCallback('a');
      expect(mockStorageService.set).toHaveBeenCalledWith('oryx.oauth-state', {
        authorizedBy: 'a',
      });
    });
  });

  describe('login', () => {
    it('should throw an error if user already authenticated', () => {
      storageTokenTrigger.next({ authorizedBy: 'a' });
      mockOauthServiceConfig.providers[0].getToken.mockReturnValue(
        of(mockConfig('A'))
      );

      getService()
        .login()
        .pipe(catchError((error) => of(callback(error))))
        .subscribe();
      expect(callback).toHaveBeenCalledWith(
        new Error('OauthService: Already authenticated!')
      );
    });

    it('should call RouterService.navigate with router from config', () => {
      getService().login();
      expect(mockRouterService.navigate).toHaveBeenCalledWith(
        mockOauthServiceConfig.loginRoute
      );
    });

    describe('and config specified default provider', () => {
      const defaultProvider = 'test';

      beforeEach(() => {
        destroyInjector();
        createInjector({
          providers: [
            ...providers,
            {
              provide: OauthServiceConfig,
              useValue: {
                ...mockOauthServiceConfig,
                defaultProvider,
              },
            },
          ],
        });

        vi.spyOn(getService(), 'loginWith');
        getService().login();
      });

      it('should login with default provider', () => {
        expect(getService().loginWith).toHaveBeenCalledWith(defaultProvider);
      });
    });
  });
});
