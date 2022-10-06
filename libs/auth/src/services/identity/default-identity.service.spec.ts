import { StorageService } from '@spryker-oryx/core';
import { createInjector, destroyInjector } from '@spryker-oryx/injector';
import { Observable, of } from 'rxjs';
import { HeaderTypes } from '../../models';
import { AccessTokenService } from '../access-token';
import { DefaultIdentityService } from './default-identity.service';
import { IdentityService } from './identity.service';

const mockToken = {
  accessToken:
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiJmcm9udGVuZCIsImp0aSI6IjgzNGE1YjQ2ZDcyMWUyNmIxNTIwZmM3ZWQ2ODU2MzQ5NDE0ZmM1NzNiNTJkNzliNTQwMDJjMWRjYmVkZWNhZGUwYmQ4M2I1MWYyY2E4MDY1IiwiaWF0IjoxNjYwMDQwMzc3LjI4MTg5OTksIm5iZiI6MTY2MDA0MDM3Ny4yODE5MDMsImV4cCI6MTY2MDA2OTE3Ny4yNzE0MTA5LCJzdWIiOiJ7XCJpZF9jb21wYW55X3VzZXJcIjpcImViZjRiNTVhLWNhYjAtNWVkMC04ZmI3LTUyNWEzZWVlZGVhY1wiLFwiaWRfYWdlbnRcIjpudWxsLFwiY3VzdG9tZXJfcmVmZXJlbmNlXCI6XCJERS0tMjFcIixcImlkX2N1c3RvbWVyXCI6MjEsXCJwZXJtaXNzaW9uc1wiOntcInBlcm1pc3Npb25zXCI6W3tcImlkX3Blcm1pc3Npb25cIjoxLFwiY29uZmlndXJhdGlvbl9zaWduYXR1cmVcIjpcIltdXCIsXCJpZF9jb21wYW55X3JvbGVcIjpudWxsLFwiY29uZmlndXJhdGlvblwiOntcImlkX3F1b3RlX2NvbGxlY3Rpb25cIjpbMjEsMjIsMjMsMjQsMjUsMjcsMjgsNDksNTAsNTEsNTIsNTNdfSxcImtleVwiOlwiUmVhZFNoYXJlZENhcnRQZXJtaXNzaW9uUGx1Z2luXCIsXCJpc19pbmZyYXN0cnVjdHVyYWxcIjpudWxsfSx7XCJpZF9wZXJtaXNzaW9uXCI6MixcImNvbmZpZ3VyYXRpb25fc2lnbmF0dXJlXCI6XCJbXVwiLFwiaWRfY29tcGFueV9yb2xlXCI6bnVsbCxcImNvbmZpZ3VyYXRpb25cIjp7XCJpZF9xdW90ZV9jb2xsZWN0aW9uXCI6WzIxLDIyLDIzLDI0LDI1LDI3LDI4LDQ5LDUwLDUxLDUyLDUzXX0sXCJrZXlcIjpcIldyaXRlU2hhcmVkQ2FydFBlcm1pc3Npb25QbHVnaW5cIixcImlzX2luZnJhc3RydWN0dXJhbFwiOm51bGx9LHtcImlkX3Blcm1pc3Npb25cIjpudWxsLFwiY29uZmlndXJhdGlvbl9zaWduYXR1cmVcIjpbXSxcImlkX2NvbXBhbnlfcm9sZVwiOm51bGwsXCJjb25maWd1cmF0aW9uXCI6e1wiaWRfc2hvcHBpbmdfbGlzdF9jb2xsZWN0aW9uXCI6e1wiMFwiOlwiMVwiLFwiMlwiOjIsXCIzXCI6M319LFwia2V5XCI6XCJSZWFkU2hvcHBpbmdMaXN0UGVybWlzc2lvblBsdWdpblwiLFwiaXNfaW5mcmFzdHJ1Y3R1cmFsXCI6bnVsbH0se1wiaWRfcGVybWlzc2lvblwiOm51bGwsXCJjb25maWd1cmF0aW9uX3NpZ25hdHVyZVwiOltdLFwiaWRfY29tcGFueV9yb2xlXCI6bnVsbCxcImNvbmZpZ3VyYXRpb25cIjp7XCJpZF9zaG9wcGluZ19saXN0X2NvbGxlY3Rpb25cIjp7XCIwXCI6XCIxXCIsXCIyXCI6MixcIjNcIjozfX0sXCJrZXlcIjpcIldyaXRlU2hvcHBpbmdMaXN0UGVybWlzc2lvblBsdWdpblwiLFwiaXNfaW5mcmFzdHJ1Y3R1cmFsXCI6bnVsbH1dfX0iLCJzY29wZXMiOlsiY3VzdG9tZXIiLCJ1c2VyIl19.rL7WOub_9zt5H-2X-9jPUGjRT4cO70gYG1nLl3mESH6WSxFvL-g07MU-Cg7zttex5sGRQl3Q2lGmnJRjKKimKjOlnt-MKDSIMJZHh7omxDYya1cYqpJjCTDZTrdtK0FLYCUpaCDuaYrb6avjvw_UqJ-_nTVDtAHZT8FBGc0uC7pOj4yZsW_DOeB0TOQOVpDOKHi3c2qvyVpSG7BM_t1vyMw1l5Sd0Hd5_xJy5ECWdy814HWFEIyLUQdjvVbur3V_AUyragCiLAPgpaoXHVb-KMiUzhqu5SDnL5woBP742E2gFf388TGT5nVUxjNaGg6jzyJJ_m7g8Jpyx6jDcSGXSQ',
  expiresAt: 28800,
  refreshToken: 'refresh token value',
  tokenType: 'Bearer',
  refreshTokenExpiresAt: 140,
};

const mockAnonymous = 'anonymous id';

const mockUserId = 'DE--21';

const mockStorage = {
  get: vi.fn(),
  set: vi.fn(),
  remove: vi.fn(),
};

class MockStorageService implements Partial<StorageService> {
  get = mockStorage.get;
  set = mockStorage.set;
  remove = mockStorage.remove;
}

const mockAccessToken = {
  get: vi.fn(),
};
class MockAccessTokenService implements Partial<AccessTokenService> {
  get = mockAccessToken.get;
}

describe('DefaultIdentityService', () => {
  let service: IdentityService;

  const setupInjector = () => {
    const testInjector = createInjector({
      providers: [
        {
          provide: StorageService,
          useClass: MockStorageService,
        },
        {
          provide: AccessTokenService,
          useClass: MockAccessTokenService,
        },
        {
          provide: IdentityService,
          useClass: DefaultIdentityService,
        },
      ],
    });

    service = testInjector.inject(IdentityService);
  };

  afterEach(() => {
    vi.resetAllMocks();
    destroyInjector();
  });

  it('should be provided', () => {
    mockAccessToken.get.mockReturnValue(of(null));
    setupInjector();

    expect(service).toBeInstanceOf(DefaultIdentityService);
  });

  describe('get', () => {
    it('should return an observable', () => {
      expect(service.get()).toBeInstanceOf(Observable);
    });

    it('should return an observable with anonymous user data', () => {
      mockAccessToken.get.mockReturnValue(of(null));
      mockStorage.get.mockReturnValue(of(mockAnonymous));
      mockStorage.set.mockReturnValue(of(null));
      setupInjector();

      const callback = vi.fn();

      service.get().subscribe(callback);

      expect(callback).toHaveBeenCalledWith({
        anonymous: true,
        id: mockAnonymous,
      });
    });

    it('should return an observable with user data', () => {
      mockAccessToken.get.mockReturnValue(of(mockToken));
      mockStorage.remove.mockReturnValue(of());
      setupInjector();

      const callback = vi.fn();

      service.get().subscribe(callback);

      expect(callback).toHaveBeenCalledWith({
        token: mockToken,
        anonymous: false,
        id: mockUserId,
      });
    });
  });

  describe('getHeaders', () => {
    it('should return an observable', () => {
      expect(service.getHeaders()).toBeInstanceOf(Observable);
    });

    it('should return an observable with anonymous user headers', () => {
      mockAccessToken.get.mockReturnValue(of(null));
      mockStorage.get.mockReturnValue(of(mockAnonymous));
      setupInjector();

      const callback = vi.fn();

      service.getHeaders().subscribe(callback);

      expect(callback).toHaveBeenCalledWith({
        [HeaderTypes.AnonymousCustomerUniqueId]: mockAnonymous,
      });
    });

    it('should return an observable with user headers', () => {
      mockAccessToken.get.mockReturnValue(of(mockToken));
      mockStorage.remove.mockReturnValue(of());
      setupInjector();

      const callback = vi.fn();

      service.getHeaders().subscribe(callback);

      expect(callback).toHaveBeenCalledWith({
        [HeaderTypes.Authorization]: `${mockToken.tokenType} ${mockToken.accessToken}`,
      });
    });
  });
});
