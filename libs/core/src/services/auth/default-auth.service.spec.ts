import {
  createInjector,
  destroyInjector,
  getInjector,
} from '@spryker-oryx/injector';
import { of, throwError } from 'rxjs';
import { AccessTokenService } from './access-token.service';
import { AuthService } from './auth.service';
import { DefaultAuthService } from './default-auth.service';
import { AccessToken, TokenExchangeParams } from './model';

const mockToken = {
  accessToken: 'token value',
  expiresIn: 28800,
  refreshToken: 'refresh token value',
  tokenType: 'Bearer',
};

let token: AccessToken | null;

const MockAccessTokenService = {
  load: vi.fn(),
  remove: vi.fn().mockImplementation(() => {
    token = null;
    return of(null);
  }),
  get: vi.fn().mockImplementation(() => {
    return of(token);
  }),
};

let persistToken: boolean;

describe('AuthService', () => {
  let service: AuthService;
  let accessTokenService: any;
  beforeEach(() => {
    createInjector({
      providers: [
        {
          provide: AccessTokenService,
          useValue: MockAccessTokenService,
        },
        {
          provide: AuthService,
          useClass: DefaultAuthService,
        },
      ],
    });
    service = getInjector().inject(AuthService);
    accessTokenService = getInjector().inject(AccessTokenService);
  });
  afterEach(() => {
    destroyInjector();
  });
  it('should be provided', () => {
    expect(service).toBeInstanceOf(DefaultAuthService);
  });

  it('should login successfully', () => {
    accessTokenService.load.mockImplementation(() => {
      token = mockToken;
      return of(mockToken);
    });
    vi.spyOn(accessTokenService, 'load');
    service.login('user', 'correct', false).subscribe((success) => {
      expect(accessTokenService.load).toHaveBeenCalledWith({
        username: 'user',
        password: 'correct',
        persist: false,
      });
      expect(success).toBe(true);
      expect(persistToken).toBeFalsy();
    });
  });
  it('should obtain a token', () => {
    vi.spyOn(accessTokenService, 'get');
    service.getToken().subscribe((token) => {
      expect(accessTokenService.get).toHaveBeenCalled();
      expect(token).toBe(mockToken);
    });
  });
  it('should be authenticated', () => {
    service.isAuthenticated().subscribe((authenticated) => {
      expect(authenticated).toBeTruthy();
    });
  });
  it('should logout', () => {
    vi.spyOn(accessTokenService, 'remove');
    service.logout();
    expect(accessTokenService.remove).toHaveBeenCalled();
    service.getToken().subscribe((token) => {
      expect(token).toBeDefined();
    });
  });
  it('should not be authenticated', () => {
    service.isAuthenticated().subscribe((authenticated) => {
      expect(authenticated).toBeFalsy();
    });
  });
  it('should fail login with wrong password', () => {
    accessTokenService.load.mockImplementation(() => {
      return throwError(() => 'no token');
    });
    service.login('user', 'wrong', false).subscribe((success) => {
      expect(success).toBe(false);
    });
  });
  it('should get no token', () => {
    service.getToken().subscribe((token) => {
      expect(token).toBeFalsy();
    });
  });

  it('should remember login successfully', () => {
    accessTokenService.load.mockImplementation(
      (params: TokenExchangeParams) => {
        persistToken = params.persist ?? false;
        return of(mockToken);
      }
    );
    vi.spyOn(accessTokenService, 'load');
    service.login('user', 'correct', true).subscribe((success) => {
      expect(success).toBeTruthy();
      expect(accessTokenService.load).toHaveBeenCalledWith({
        username: 'user',
        password: 'correct',
        persist: true,
      });
      expect(persistToken).toBeTruthy();
    });
  });
});
