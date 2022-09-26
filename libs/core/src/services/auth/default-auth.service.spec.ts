import { createInjector, destroyInjector } from '@spryker-oryx/injector';
import { of, Subject, switchMap, throwError } from 'rxjs';
import { AccessTokenService } from './access-token.service';
import { AuthAdapter } from './adapter';
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
  set = vi.fn();
  remove = vi.fn();
  get = vi.fn();
}

class MockAuthAdapter implements Partial<AuthAdapter> {
  authenticate = vi.fn();
  refresh = vi.fn();
  revoke = vi.fn();
}

describe('DefaultAuthService', () => {
  let service: AuthService;
  let accessTokenService: MockAccessTokenService;
  let authAdapter: MockAuthAdapter;

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
        {
          provide: AuthAdapter,
          useClass: MockAuthAdapter,
        },
      ],
    });

    service = testInjector.inject(AuthService);
    accessTokenService = testInjector.inject(
      AccessTokenService
    ) as unknown as MockAccessTokenService;
    authAdapter = testInjector.inject(AuthAdapter) as MockAuthAdapter;
  });

  afterEach(() => {
    vi.resetAllMocks();
    destroyInjector();
  });

  describe('logout', () => {
    it('should call AccessTokenService.remove', () => {
      accessTokenService.remove.mockReturnValue(of(null));
      service.logout();

      expect(accessTokenService.remove).toHaveBeenCalled();
    });

    it('should return Observable<null>', () => {
      const callback = vi.fn();

      accessTokenService.remove.mockReturnValue(of(null));
      service.logout().subscribe(callback);

      expect(callback).toHaveBeenCalledWith(null);
    });
  });

  describe('login', () => {
    const callback = vi.fn();

    beforeEach(() => {
      callback.mockClear();
    });

    it('should call AuthAdapter.authenticate method', () => {
      authAdapter.authenticate.mockReturnValue(of(mockToken));
      service.login(mockCredentials);

      expect(authAdapter.authenticate).toHaveBeenCalledWith(mockCredentials);
    });

    it('should return Observable<true> if AuthAdapter.authenticate returns access token', () => {
      authAdapter.authenticate.mockReturnValue(of(mockToken));

      service.login(mockCredentials).subscribe(callback);

      expect(callback).toHaveBeenCalledWith(true);
    });

    it('should return Observable<false> if AuthAdapter.authenticate returns null', () => {
      authAdapter.authenticate.mockReturnValue(of(null));

      service.login(mockCredentials).subscribe(callback);

      expect(callback).toHaveBeenCalledWith(false);
    });

    it('should throw an error if AuthAdapter.authenticate throws an error', () => {
      const errorCallback = vi.fn();

      accessTokenService.remove.mockReturnValue(of(null));
      authAdapter.authenticate.mockImplementationOnce(() =>
        throwError(() => of(null))
      );

      service.login(mockCredentials).subscribe({
        next: callback,
        error: errorCallback,
      });

      expect(callback).not.toHaveBeenCalled();
      expect(errorCallback).toHaveBeenCalled();
    });
    ``;
  });

  describe('isAuthenticated', () => {
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
