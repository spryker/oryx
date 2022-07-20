import { createInjector, destroyInjector } from '@spryker-oryx/injector';
import { of, Subject, switchMap, throwError } from 'rxjs';
import { AccessTokenService } from './access-token.service';
import { AuthService } from './auth.service';
import { DefaultAuthService } from './default-auth.service';

const mockToken = {
  accessToken: 'token value',
  expiresIn: 28800,
  refreshToken: 'refresh token value',
  tokenType: 'Bearer',
};

const mockCredentials = {
  username: 'user',
  password: 'correct',
  persist: false,
};

class MockAccessTokenService implements Partial<AccessTokenService> {
  load = vi.fn();
  remove = vi.fn();
  get = vi.fn();
}

describe('DefaultAuthService', () => {
  let service: AuthService;
  let accessTokenService: MockAccessTokenService;

  beforeEach(() => {
    const testInjector = createInjector({
      providers: [
        {
          provide: AccessTokenService,
          useClass: MockAccessTokenService,
        },
        {
          provide: AuthService,
          useClass: DefaultAuthService,
        },
      ],
    });

    service = testInjector.inject(AuthService);
    accessTokenService = testInjector.inject(
      AccessTokenService
    ) as unknown as MockAccessTokenService;
  });

  afterEach(() => {
    vi.resetAllMocks();
    destroyInjector();
  });

  describe('logout', () => {
    it('should call AccessTokenService.remove', () => {
      service.logout();
      expect(accessTokenService.remove).toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('should call logout', () => {
      accessTokenService.load.mockReturnValue(of(mockToken));
      service.login(
        mockCredentials.username,
        mockCredentials.password,
        mockCredentials.persist
      );
      expect(accessTokenService.remove).toHaveBeenCalled();
    });

    it('should call AccessTokenService.load method', () => {
      accessTokenService.load.mockReturnValue(of(mockToken));
      service.login(
        mockCredentials.username,
        mockCredentials.password,
        mockCredentials.persist
      );
      expect(accessTokenService.load).toHaveBeenCalledWith(mockCredentials);
    });

    it('should return Observable<boolean> depends on AccessTokenService.load result', () => {
      const trigger$ = new Subject();
      const callback = vi.fn();
      trigger$
        .pipe(
          switchMap((value) => {
            accessTokenService.load.mockReturnValue(value);

            return service.login(
              mockCredentials.username,
              mockCredentials.password,
              mockCredentials.persist
            );
          })
        )
        .subscribe(callback);
      trigger$.next(throwError(() => null));
      expect(callback).toHaveBeenNthCalledWith(1, false);
      trigger$.next(of(mockToken));
      expect(callback).toHaveBeenNthCalledWith(2, true);
      trigger$.next(of(null));
      expect(callback).toHaveBeenNthCalledWith(3, false);
    });
  });

  describe('getToken', () => {
    it('should return result of AccessTokenService.get', () => {
      const mockResult = 'mockResult';
      accessTokenService.get.mockReturnValue(mockResult);
      const result = service.getToken();
      expect(accessTokenService.get).toHaveBeenCalled();
      expect(result).toBe(mockResult);
    });
  });

  describe('isAuthenticated', () => {
    it('should call getToken', () => {
      service.getToken();
      expect(accessTokenService.get).toHaveBeenCalled();
    });

    it('should return Observable<boolean> depends on getToken result', () => {
      const trigger$ = new Subject();
      const callback = vi.fn();
      trigger$
        .pipe(
          switchMap((value) => {
            accessTokenService.get.mockReturnValue(value);

            return service.isAuthenticated();
          })
        )
        .subscribe(callback);

      trigger$.next(of(mockToken));
      expect(callback).toHaveBeenNthCalledWith(1, true);
      trigger$.next(of(null));
      expect(callback).toHaveBeenNthCalledWith(2, false);
    });
  });
});
