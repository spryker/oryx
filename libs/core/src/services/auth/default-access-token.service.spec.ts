import {
  createInjector,
  destroyInjector,
  getInjector,
} from '@spryker-oryx/injector';
import { Observable, of } from 'rxjs';
import { HttpTestService } from '../../../testing';
import { HttpService } from '../http';
import { StorageService, StorageType } from '../storage';
import { AccessTokenService } from './access-token.service';
import { DefaultAccessTokenService } from './default-access-token.service';

const now = Date.now();

const mockPasswordResponse = {
  access_token: 'token value',
  expires_in: 28800,
  refresh_token: 'refresh token value',
  token_type: 'Bearer',
};

const mockCodeResponse = {
  accessToken: 'code token value',
  expiresAt: now + 28800,
  refreshToken: 'refresh token value',
  tokenType: 'Bearer',
};

const mockRefreshResponse = {
  access_token: 'a new token',
  expires_in: 28800,
  refresh_token: 'have another',
  token_type: 'Bearer',
};

const mockToken = {
  accessToken: 'token value',
  expiresAt: now + 28800,
  refreshToken: 'refresh token value',
  tokenType: 'Bearer',
};

const mockApiUrl = 'mockApiUrl';

const key = 'access-token';

let expectedKey: any;
let expectedValue: any;

class MockStorageService implements Partial<StorageService> {
  get(key: string, type?: StorageType): Observable<any> {
    return of(mockToken);
  }
  set(key: string, value: any, type?: StorageType): Observable<void> {
    expectedKey = key;
    expectedValue = value;
    return of();
  }
  remove(key: string, type?: StorageType): Observable<void> {
    return of();
  }
}

describe('AccessTokenService', () => {
  let service: AccessTokenService;
  let http: HttpTestService;
  let storage: MockStorageService;

  beforeEach(() => {
    createInjector({
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

    service = getInjector().inject(AccessTokenService);
    http = getInjector().inject(HttpService) as HttpTestService;
    storage = getInjector().inject(StorageService) as MockStorageService;
  });
  afterEach(() => {
    destroyInjector();
  });
  it('should be provided', () => {
    expect(service).toBeInstanceOf(DefaultAccessTokenService);
  });

  it('should load a password token', () => {
    http.flush(mockPasswordResponse);
    service
      .load({ username: 'user', password: 'password' })
      .subscribe((token) => {
        expect(token).toBeDefined();
        expect(token?.accessToken).toBe(mockPasswordResponse.access_token);
      });
  });
  it('should refresh a token', () => {
    http.flush(mockRefreshResponse);
    service
      .renew({ ...mockCodeResponse, refreshTokenExpiresAt: 0 })
      .subscribe((token) => {
        expect(token).toBeDefined();
        expect(token?.accessToken).toBe(mockRefreshResponse.access_token);
      });
  });
  it('should store a password token', () => {
    vi.spyOn(storage, 'set');
    http.flush(mockPasswordResponse);
    service.load({ username: 'user', password: 'password' }).subscribe(() => {
      expect(storage.set).toHaveBeenCalled();
      expect(expectedKey).toBe(key);
      expect(expectedValue.accessToken).toBe(mockToken.accessToken);
    });
  });
  it('should get a token', () => {
    vi.spyOn(storage, 'get');
    service.get().subscribe(() => {
      expect(storage.get).toHaveBeenCalledWith(key);
    });
  });
  it('should store refreshed token', () => {
    vi.spyOn(storage, 'set');
    http.flush(mockRefreshResponse);
    service
      .renew({ ...mockCodeResponse, refreshTokenExpiresAt: 0 })
      .subscribe(() => {
        expect(storage.set).toHaveBeenCalled();
        expect(expectedKey).toBe(key);
        expect(expectedValue.accessToken).toBe(
          mockRefreshResponse.access_token
        );
      });
  });
  it('should remove a token', () => {
    vi.spyOn(storage, 'remove');
    service.remove();
    expect(storage.remove).toHaveBeenCalledWith(key);
  });
});
