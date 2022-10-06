import { HttpService, StorageService, StorageType } from '@spryker-oryx/core';
import { HttpTestService } from '@spryker-oryx/core/testing';
import {
  createInjector,
  destroyInjector,
  Injector,
} from '@spryker-oryx/injector';
import { Observable, of } from 'rxjs';
import { AuthAdapter } from '../auth';
import { AccessTokenService } from './access-token.service';
import { DefaultAccessTokenService } from './default-access-token.service';

const accessTokenIdentifier = 'access-token';
const mockApiUrl = 'mockApiUrl';
const mockDateNow = 100;
const mockToMilliseconds = 100;

const mockToken = {
  accessToken: 'token value',
  expiresAt: 28800,
  refreshToken: 'refresh token value',
  tokenType: 'Bearer',
  refreshTokenExpiresAt: 140,
};

const mockStorageService = {
  get: vi.fn().mockReturnValue(of(null)),
  set: vi.fn(),
  remove: vi.fn().mockReturnValue(of(null)),
};

class MockStorageService implements Partial<StorageService> {
  get = mockStorageService.get;
  set = mockStorageService.set;
  remove = mockStorageService.remove;
}

class MockAuthAdapter implements Partial<AuthAdapter> {
  refresh = vi.fn();
}

const utils = {
  requiresRefresh: vi.fn(),
  canRenew: vi.fn(),
};

vi.mock('../../utils', () => ({
  requiresRefresh: (): boolean => utils.requiresRefresh(),
  canRenew: (): boolean => utils.canRenew(),
}));

vi.mock('@spryker-oryx/typescript-utils', () => ({
  toMilliseconds: (): number => mockToMilliseconds,
}));

const storageType = (persist: boolean): StorageType =>
  persist ? StorageType.LOCAL : StorageType.SESSION;

describe('AccessTokenService', () => {
  let testInjector: Injector;
  let service: AccessTokenService;
  let http: HttpTestService;
  let storage: MockStorageService;

  const setupInjectorMocks = () => {
    testInjector = createInjector({
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
        {
          provide: AuthAdapter,
          useClass: MockAuthAdapter,
        },
      ],
    });

    http = testInjector.inject(HttpService) as HttpTestService;
    storage = testInjector.inject(
      StorageService
    ) as unknown as MockStorageService;
    service = testInjector.inject(AccessTokenService);
  };

  const clearInjectorMocks = () => {
    vi.clearAllMocks();
    destroyInjector();
    http.clear();
  };

  beforeEach(() => {
    vi.spyOn(global.Date, 'now').mockReturnValue(mockDateNow);

    setupInjectorMocks();
  });

  afterEach(clearInjectorMocks);

  describe('default values', () => {
    it('should return null if storage is empty', () => {
      service.get().subscribe((tokenData) => {
        expect(tokenData).toBe(null);
      });
    });

    it('should return value from storage', () => {
      clearInjectorMocks();

      storage.get.mockReturnValueOnce(of(mockToken));

      setupInjectorMocks();

      service.get().subscribe((tokenData) => {
        expect(tokenData).toBe(mockToken);
      });
    });
  });

  describe('get', () => {
    it('should return an observable', () => {
      expect(service.get()).toBeInstanceOf(Observable);
    });
  });

  describe('set', () => {
    it('should set new token value to session storage if persist is false or undefined', () => {
      const callback = vi.fn();

      service.get().subscribe(callback);

      expect(callback).toHaveBeenCalledWith(null);

      callback.mockClear();
      service.set({ token: mockToken });

      expect(callback).toHaveBeenCalledWith(mockToken);
      expect(storage.set).toHaveBeenCalledWith(
        accessTokenIdentifier,
        mockToken,
        storageType(false)
      );

      callback.mockClear();
      service.set({ token: mockToken, persist: false });

      expect(callback).toHaveBeenCalledWith(mockToken);
      expect(storage.set).toHaveBeenCalledWith(
        accessTokenIdentifier,
        mockToken,
        storageType(false)
      );
    });

    it('should set new token value to local storage if persist is true', () => {
      const callback = vi.fn();

      service.get().subscribe(callback);

      expect(callback).toHaveBeenCalledWith(null);

      callback.mockClear();
      service.set({ token: mockToken, persist: true });

      expect(callback).toHaveBeenCalledWith(mockToken);
      expect(storage.set).toHaveBeenCalledWith(
        accessTokenIdentifier,
        mockToken,
        storageType(true)
      );
    });
  });

  describe('remove', () => {
    it(`should remove token from session storage if persist is false`, () => {
      const callback = vi.fn();

      service.set({ token: mockToken });
      service.get().subscribe(callback);
      service.remove();

      expect(callback).toHaveBeenCalledWith(null);
      expect(storage.remove).toBeCalledWith(accessTokenIdentifier, 'session');
    });

    it(`should remove token from local storage if persist is true`, () => {
      const callback = vi.fn();

      service.set({ token: mockToken, persist: true });
      service.get().subscribe(callback);
      service.remove();

      expect(callback).toHaveBeenCalledWith(null);
      expect(storage.remove).toBeCalledWith(
        accessTokenIdentifier,
        storageType(true)
      );
    });
  });

  describe('renew', () => {
    it('should renew token', () => {
      clearInjectorMocks();
      storage.get.mockImplementation((key: string, type: string) =>
        type === 'local' ? of(mockToken) : of(null)
      );
      setupInjectorMocks();

      const adapter = testInjector.inject(
        AuthAdapter
      ) as unknown as MockAuthAdapter;
      const callback = vi.fn();
      const mockRenewedToken = {
        ...mockToken,
        expiresAt: 100101000100,
      };

      adapter.refresh.mockReturnValue(of(mockRenewedToken));
      utils.requiresRefresh.mockReturnValueOnce(true);
      utils.canRenew.mockReturnValueOnce(true);

      service.get().subscribe(callback);

      expect(adapter.refresh).toHaveBeenCalled();
      expect(storage.set).toHaveBeenCalledWith(
        accessTokenIdentifier,
        mockRenewedToken,
        storageType(true)
      );
    });
  });
});
