import {
  createInjector,
  destroyInjector,
  getInjector,
} from '@spryker-oryx/injector';
import { of } from 'rxjs';
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

let expectedKey: string;
let expectedValue: any;
let expectedType: StorageType | undefined;

let persist = false;

const MockStorageService = {
  get: vi.fn().mockImplementation((key) => {
    return key === 'access-token-persist' ? of(persist) : of(mockToken);
  }),
  set: vi
    .fn()
    .mockImplementation((key: string, value: any, type?: StorageType) => {
      expectedKey = key;
      expectedValue = value;
      expectedType = type;
      return of(null);
    }),
  remove: vi.fn().mockImplementation(() => of(null)),
};

describe('AccessTokenService', () => {
  let service: AccessTokenService;
  let http: HttpTestService;
  let storage: any;

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
          useValue: MockStorageService,
        },
      ],
    });

    service = getInjector().inject(AccessTokenService);
    http = getInjector().inject(HttpService) as HttpTestService;
    storage = getInjector().inject(StorageService);
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
    service.get().subscribe((token) => {
      expect(storage.get).toHaveBeenCalledWith(key, StorageType.SESSION);
      expect(token).toBe(mockToken);
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
  it('should remove a token', async () => {
    vi.spyOn(storage, 'remove');
    service.remove().subscribe(() => {
      expect(storage.remove).toHaveBeenCalledWith(key, StorageType.SESSION);
    });
  });
  it('should store a password token in local storage', () => {
    vi.spyOn(storage, 'set');
    http.flush(mockPasswordResponse);
    persist = true;
    service
      .load({ username: 'user', password: 'password', persist: true })
      .subscribe(() => {
        expect(storage.set).toHaveBeenCalled();
        expect(expectedKey).toBe(key);
        expect(expectedType).toBe(StorageType.DEFAULT);
        expect(expectedValue.accessToken).toBe(mockToken.accessToken);
      });
  });
  it('should get a token from local storage', () => {
    vi.spyOn(storage, 'get');
    service.get().subscribe((token) => {
      expect(storage.get).toHaveBeenCalledWith(key, StorageType.DEFAULT);
      expect(token).toBe(mockToken);
    });
  });
  it('should store refreshed token in local storage', () => {
    vi.spyOn(storage, 'set');
    http.flush(mockRefreshResponse);
    service
      .renew({ ...mockCodeResponse, refreshTokenExpiresAt: 0 })
      .subscribe(() => {
        expect(storage.set).toHaveBeenCalled();
        expect(expectedKey).toBe(key);
        expect(expectedType).toBe(StorageType.DEFAULT);
        expect(expectedValue.accessToken).toBe(
          mockRefreshResponse.access_token
        );
      });
  });
  it('should remove a token from local storage', async () => {
    vi.spyOn(storage, 'remove');
    service.remove().subscribe(() => {
      expect(storage.remove).toHaveBeenCalledWith(key, StorageType.DEFAULT);
    });
  });
});
