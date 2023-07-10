import { nextFrame } from '@open-wc/testing-helpers';
import { HttpService, StorageService } from '@spryker-oryx/core';
import { HttpTestService } from '@spryker-oryx/core/testing';
import { createInjector, destroyInjector, getInjector } from '@spryker-oryx/di';
import { BehaviorSubject, catchError, of, switchMap } from 'rxjs';
import { OauthTokenInterceptor } from '../oauth-token.interceptor';
import {
  OauthPasswordGrantProvider,
  OauthPasswordGrantProviderConfig,
  OauthPasswordProviderRequest,
} from './password-grant';

const mockStorage = {
  get: vi.fn(),
  set: vi.fn(),
  remove: vi.fn(),
};

const mockConfig: OauthPasswordGrantProviderConfig = {
  clientId: 'clientId',
  id: 'id',
  grantType: 'password',
  tokenUrl: 'tokenUrl',
};

const callback = vi.fn();

describe('OauthPasswordGrantProvider', () => {
  const setup = (config = mockConfig) => {
    const testInjector = createInjector({
      providers: [
        {
          provide: HttpService,
          useClass: HttpTestService,
        },
        {
          provide: StorageService,
          useValue: mockStorage,
        },
        {
          provide: OauthPasswordGrantProvider,
          useFactory: () => new OauthPasswordGrantProvider(config),
        },
      ],
    });

    return testInjector.inject(OauthPasswordGrantProvider);
  };

  afterEach(() => {
    vi.resetAllMocks();
    destroyInjector();
  });

  describe('authenticate', () => {
    it('should throw error if token exist', async () => {
      mockStorage.get.mockReturnValue(of('token'));
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

    it('should throw error if request has not enough data', async () => {
      mockStorage.get.mockReturnValue(of(null));
      const service = setup();
      const trigger = new BehaviorSubject<
        OauthPasswordProviderRequest | undefined
      >(undefined);
      trigger
        .pipe(
          switchMap((request) =>
            service
              .authenticate(request)
              .pipe(catchError((error) => of(callback(error))))
          )
        )
        .subscribe();
      await nextFrame();
      expect(callback).toHaveBeenNthCalledWith(
        1,
        new Error('Missing username/password!')
      );
      trigger.next({ username: 'username', password: '' });
      await nextFrame();
      expect(callback).toHaveBeenNthCalledWith(
        2,
        new Error('Missing username/password!')
      );
      trigger.next({ username: '', password: 'password' });
      await nextFrame();
      expect(callback).toHaveBeenNthCalledWith(
        3,
        new Error('Missing username/password!')
      );
    });

    it('should send request if all data is correct', async () => {
      mockStorage.get.mockReturnValue(of(null));
      mockStorage.remove.mockReturnValue(of(null));
      const mockSearchConstructor = vi.fn();
      vi.stubGlobal('URLSearchParams', mockSearchConstructor);
      const service = setup();
      service
        .authenticate({ username: 'name', password: 'password' })
        .subscribe();
      const http = getInjector().inject(HttpService) as HttpTestService;
      expect(http.url).toBe(mockConfig.tokenUrl);
      expect(mockSearchConstructor).toHaveBeenCalledWith({
        username: 'name',
        password: 'password',
        client_id: mockConfig.clientId,
        grant_type: mockConfig.grantType,
      });
      expect(http.options).toEqual({
        body: expect.anything(),
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          [OauthTokenInterceptor.HEADER_NAME]: 'password',
        },
      });
    });

    it('should remove token from storage if response without token', async () => {
      mockStorage.get.mockReturnValue(of(null));
      mockStorage.remove.mockReturnValue(of(null));
      const service = setup();
      const http = getInjector().inject(HttpService) as HttpTestService;
      http.flush(undefined);
      service
        .authenticate({ username: 'name', password: 'password' })
        .subscribe();
      expect(mockStorage.remove).toHaveBeenCalledWith('oryx.oauth-token');
    });

    it('should set token to storage if response with token', async () => {
      mockStorage.get.mockReturnValue(of(null));
      mockStorage.set.mockReturnValue(of(null));
      const service = setup();
      const http = getInjector().inject(HttpService) as HttpTestService;
      http.flush('token');
      service
        .authenticate({ username: 'name', password: 'password' })
        .subscribe();
      expect(mockStorage.set).toHaveBeenCalledWith('oryx.oauth-token', 'token');
    });
  });

  describe('refreshToken', () => {
    it('should return undefined if refresh token is not exist', async () => {
      mockStorage.get.mockReturnValue(of({}));
      const service = setup();
      service.refreshToken().subscribe(callback);
      expect(callback).toHaveBeenCalledWith(undefined);
    });

    it('should send request', async () => {
      mockStorage.get.mockReturnValue(
        of({ refresh_token: 'token_refresh_token' })
      );
      mockStorage.remove.mockReturnValue(of(null));
      const mockSearchConstructor = vi.fn();
      vi.stubGlobal('URLSearchParams', mockSearchConstructor);
      const service = setup();
      service.refreshToken().subscribe();
      const http = getInjector().inject(HttpService) as HttpTestService;
      expect(http.url).toBe(mockConfig.tokenUrl);
      expect(mockSearchConstructor).toHaveBeenCalledWith({
        grant_type: 'refresh_token',
        refresh_token: 'token_refresh_token',
      });
      expect(http.options).toEqual({
        body: expect.anything(),
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          [OauthTokenInterceptor.HEADER_NAME]: 'password',
        },
      });
    });

    it('should remove token from storage if response without token', async () => {
      mockStorage.get.mockReturnValue(
        of({ refresh_token: 'token_refresh_token' })
      );
      mockStorage.remove.mockReturnValue(of(null));
      const service = setup();
      const http = getInjector().inject(HttpService) as HttpTestService;
      http.flush(undefined);
      service.refreshToken().subscribe();
      expect(mockStorage.remove).toHaveBeenCalledWith('oryx.oauth-token');
    });

    it('should set token to storage if response with token', async () => {
      mockStorage.get.mockReturnValue(
        of({ refresh_token: 'token_refresh_token' })
      );
      mockStorage.set.mockReturnValue(of(null));
      const service = setup();
      const http = getInjector().inject(HttpService) as HttpTestService;
      http.flush('token');
      service.refreshToken().subscribe();
      expect(mockStorage.set).toHaveBeenCalledWith('oryx.oauth-token', 'token');
    });
  });

  describe('revoke', () => {
    it('should remove token from storage', async () => {
      mockStorage.get.mockReturnValue(of(null));
      mockStorage.remove.mockReturnValue(of(undefined));
      const service = setup();
      service.revoke().subscribe();
      expect(mockStorage.remove).toHaveBeenCalledWith('oryx.oauth-token');
    });
  });

  describe('getToken', () => {
    it('should return token', async () => {
      mockStorage.get.mockReturnValue(of('passwordToken'));
      const service = setup();
      service.getToken().subscribe(callback);
      await nextFrame();
      expect(mockStorage.get).toHaveBeenCalledWith('oryx.oauth-token');
      expect(callback).toHaveBeenCalledWith('passwordToken');
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
