import { createInjector, destroyInjector } from '@spryker-oryx/injector';
import { Observable, of, Subject, switchMap } from 'rxjs';
import { HttpTestService } from '../../../testing';
import { HttpService } from '../http';
import { StorageService, StorageType } from '../storage';
import { AccessTokenService } from './access-token.service';
import { DefaultAccessTokenService } from './default-access-token.service';

const accessTokenIdentifier = 'access-token';
const persistTokenIdentifier = 'access-token-persist';
const mockApiUrl = 'mockApiUrl';
const mockDateNow = 100;
const mockToMilliseconds = 100;

const mockCredentials = {
  username: 'user',
  password: 'correct',
  persist: true,
};

const mockRefreshResponse = {
  access_token: 'a new token',
  expires_in: 228800,
  refresh_token: 'have another',
  token_type: 'Bearer B',
};
const mockToken = {
  accessToken: 'token value',
  expiresAt: 28800,
  refreshToken: 'refresh token value',
  tokenType: 'Bearer',
  refreshTokenExpiresAt: 140,
};
const mockConvertedRefreshToken = {
  accessToken: mockRefreshResponse.access_token,
  refreshToken: mockRefreshResponse.refresh_token,
  tokenType: mockRefreshResponse.token_type,
  expiresAt: mockDateNow + mockToMilliseconds,
};

class MockStorageService implements Partial<StorageService> {
  get = vi.fn();
  set = vi.fn();
  remove = vi.fn();
}

const utils = {
  requiresRefresh: vi.fn(),
  canRenew: vi.fn(),
};

vi.mock('./utils.ts', () => ({
  requiresRefresh: (): boolean => utils.requiresRefresh(),
  canRenew: (): boolean => utils.canRenew(),
}));

vi.mock('@spryker-oryx/typescript-utils', () => ({
  toMilliseconds: (): number => mockToMilliseconds,
}));

const storageType = (persist: boolean): StorageType =>
  persist ? StorageType.DEFAULT : StorageType.SESSION;

describe('AccessTokenService', () => {
  let service: AccessTokenService;
  let http: HttpTestService;
  let storage: MockStorageService;

  beforeEach(() => {
    vi.spyOn(global.Date, 'now').mockReturnValue(mockDateNow);

    const testInjector = createInjector({
      providers: [
        {
          provide: HttpService,
          useClass: HttpTestService,
        },
        {
          provide: AccessTokenService,
          useClass: DefaultAccessTokenService,
        },
        {
          provide: 'SCOS_BASE_URL',
          useValue: mockApiUrl,
        },
        {
          provide: StorageService,
          useClass: MockStorageService,
        },
      ],
    });

    service = testInjector.inject(AccessTokenService);
    http = testInjector.inject(HttpService) as HttpTestService;
    storage = testInjector.inject(
      StorageService
    ) as unknown as MockStorageService;
  });

  afterEach(() => {
    vi.resetAllMocks();
    destroyInjector();
    http.clear();
  });

  const request = (
    cb: () => {
      observable$: Observable<unknown>;
      body: string;
    }
  ): void => {
    beforeEach(() => {
      http.flush(mockRefreshResponse);
      storage.get.mockReturnValue(of(mockToken));
    });

    it('should send post request', () => {
      storage.get.mockReturnValueOnce(of(true));
      cb().observable$.subscribe();

      expect(http.url).toBe(`${mockApiUrl}/token`);
      expect(http.options).toEqual({
        body: cb().body,
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
    });

    it('should return Observable<AccessToken>', () => {
      const callback = vi.fn();
      storage.get.mockReturnValueOnce(of(true));
      cb().observable$.subscribe(callback);
      expect(callback).toHaveBeenCalledWith(mockConvertedRefreshToken);
    });
  };

  describe('remove', () => {
    it(`should call StorageService.remove with ${accessTokenIdentifier} and StorageType depends on result of StorageService.get with ${persistTokenIdentifier}`, () => {
      const trigger$ = new Subject();
      storage.remove.mockReturnValue(of(null));
      trigger$
        .pipe(
          switchMap((persist) => {
            storage.get.mockReturnValue(of(persist));

            return service.remove();
          })
        )
        .subscribe();

      trigger$.next(true);
      expect(storage.get).toHaveBeenNthCalledWith(1, persistTokenIdentifier);
      expect(storage.remove).toHaveBeenNthCalledWith(
        1,
        accessTokenIdentifier,
        StorageType.DEFAULT
      );
      trigger$.next(false);
      expect(storage.get).toHaveBeenNthCalledWith(2, persistTokenIdentifier);
      expect(storage.remove).toHaveBeenNthCalledWith(
        2,
        accessTokenIdentifier,
        StorageType.SESSION
      );
    });
  });

  describe('get', () => {
    beforeEach(() => {
      utils.requiresRefresh.mockReturnValue(false);
    });

    it(`should call StorageService.get with ${accessTokenIdentifier} and StorageType depends on result of StorageService.get with ${persistTokenIdentifier}`, () => {
      const trigger$ = new Subject<boolean>();
      storage.get.mockReturnValue(of(null));
      trigger$
        .pipe(
          switchMap((persist: boolean) => {
            storage.get.mockReturnValueOnce(of(persist));
            storage.get.mockReturnValueOnce(of(storageType(persist)));

            return service.get();
          })
        )
        .subscribe();

      trigger$.next(true);
      expect(storage.get).toHaveBeenNthCalledWith(1, persistTokenIdentifier);
      expect(storage.get).toHaveBeenNthCalledWith(
        2,
        accessTokenIdentifier,
        storageType(true)
      );
      trigger$.next(false);
      expect(storage.get).toHaveBeenNthCalledWith(3, persistTokenIdentifier);
      expect(storage.get).toHaveBeenNthCalledWith(
        4,
        accessTokenIdentifier,
        storageType(false)
      );
    });

    it('should return Observable<token> from storage if token exist and should not be refreshed', () => {
      const callback = vi.fn();
      storage.get.mockReturnValueOnce(of(true));
      storage.get.mockReturnValue(of(mockToken));
      service.get().subscribe(callback);
      expect(callback).toHaveBeenCalledWith(mockToken);
    });

    it('should return Observable<null> if token is null', () => {
      const callback = vi.fn();
      storage.get.mockReturnValueOnce(of(true));
      storage.get.mockReturnValue(of(null));
      service.get().subscribe(callback);
      expect(callback).toHaveBeenCalledWith(null);
    });

    describe('with refresh', () => {
      beforeEach(() => {
        utils.canRenew.mockReturnValue(true);
        utils.requiresRefresh.mockReturnValue(true);
        storage.get.mockReturnValue(of(mockToken));
      });

      request(() => ({
        observable$: service.get(),
        body: `grant_type=refresh_token&refresh_token=${mockToken.refreshToken}`,
      }));

      it(`should call StorageService.set with ${accessTokenIdentifier}, converted token and StorageType depends on result of StorageService.get with ${persistTokenIdentifier}`, () => {
        const trigger$ = new Subject();
        storage.set.mockReturnValue(of(null));
        trigger$
          .pipe(
            switchMap((persist) => {
              storage.get.mockReturnValueOnce(of(true));
              storage.get.mockReturnValueOnce(of(mockToken));
              storage.get.mockReturnValue(of(persist));

              return service.get();
            })
          )
          .subscribe();

        trigger$.next(true);
        expect(storage.get).toHaveBeenNthCalledWith(3, persistTokenIdentifier);
        expect(storage.set).toHaveBeenNthCalledWith(
          1,
          accessTokenIdentifier,
          mockConvertedRefreshToken,
          StorageType.DEFAULT
        );
        trigger$.next(false);
        expect(storage.get).toHaveBeenNthCalledWith(6, persistTokenIdentifier);
        expect(storage.set).toHaveBeenNthCalledWith(
          2,
          accessTokenIdentifier,
          mockConvertedRefreshToken,
          StorageType.SESSION
        );
      });
    });
  });

  describe('renew', () => {
    request(() => ({
      observable$: service.renew(mockToken),
      body: `grant_type=refresh_token&refresh_token=${mockToken.refreshToken}`,
    }));

    it(`should call StorageService.set with ${accessTokenIdentifier}, converted token and StorageType depends on result of StorageService.get with ${persistTokenIdentifier}`, () => {
      const trigger$ = new Subject();
      storage.set.mockReturnValue(of(null));
      trigger$
        .pipe(
          switchMap((persist) => {
            storage.get.mockReturnValue(of(persist));

            return service.renew(mockToken);
          })
        )
        .subscribe();

      trigger$.next(true);
      expect(storage.get).toHaveBeenNthCalledWith(1, persistTokenIdentifier);
      expect(storage.set).toHaveBeenNthCalledWith(
        1,
        accessTokenIdentifier,
        mockConvertedRefreshToken,
        StorageType.DEFAULT
      );
      trigger$.next(false);
      expect(storage.get).toHaveBeenNthCalledWith(2, persistTokenIdentifier);
      expect(storage.set).toHaveBeenNthCalledWith(
        2,
        accessTokenIdentifier,
        mockConvertedRefreshToken,
        StorageType.SESSION
      );
    });
  });

  describe('load', () => {
    it(`should store persist value into storage`, () => {
      storage.get.mockReturnValue(of(mockToken));
      service.load(mockCredentials);
      expect(storage.set).toHaveBeenCalledWith(
        persistTokenIdentifier,
        mockCredentials.persist
      );
    });

    request(() => ({
      observable$: service.load(mockCredentials),
      body: `grant_type=password&username=${mockCredentials.username}&password=${mockCredentials.password}`,
    }));

    it(`should call StorageService.set with ${accessTokenIdentifier}, converted token and StorageType depends on result of StorageService.get with ${persistTokenIdentifier}`, () => {
      const trigger$ = new Subject();
      storage.set.mockReturnValue(of(null));
      trigger$
        .pipe(
          switchMap((persist) => {
            storage.get.mockReturnValue(of(persist));

            return service.load(mockCredentials);
          })
        )
        .subscribe();

      trigger$.next(true);
      expect(storage.get).toHaveBeenNthCalledWith(1, persistTokenIdentifier);
      expect(storage.set).toHaveBeenNthCalledWith(
        2,
        accessTokenIdentifier,
        mockConvertedRefreshToken,
        StorageType.DEFAULT
      );
      trigger$.next(false);
      expect(storage.get).toHaveBeenNthCalledWith(2, persistTokenIdentifier);
      expect(storage.set).toHaveBeenNthCalledWith(
        4,
        accessTokenIdentifier,
        mockConvertedRefreshToken,
        StorageType.SESSION
      );
    });
  });
});
