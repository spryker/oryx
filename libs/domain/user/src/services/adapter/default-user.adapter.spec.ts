import { AuthIdentity, IdentityService } from '@spryker-oryx/auth';
import { HttpService, JsonAPITransformerService } from '@spryker-oryx/core';
import { HttpTestService } from '@spryker-oryx/core/testing';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { Observable, of } from 'rxjs';
import { DefaultUserAdapter } from './default-user.adapter';
import { UserNormalizer } from './normalizers';
import { UserAdapter } from './user.adapter';

const mockApiUrl = 'mockApiUrl';

const mockAnonymousUser: AuthIdentity = {
  userId: 'userId',
  isAuthenticated: false,
};

const mockUser: AuthIdentity = {
  userId: 'userId',
  isAuthenticated: true,
};

const mockTransformer = {
  transform: vi.fn().mockReturnValue(of(null)),
  do: vi.fn().mockReturnValue(() => of(null)),
  serialize: vi.fn().mockReturnValue(of(null)),
};

class MockIdentityService implements Partial<IdentityService> {
  get = vi
    .fn<[], Observable<AuthIdentity>>()
    .mockReturnValue(of(mockAnonymousUser));
}

describe('DefaultUserAdapter', () => {
  let service: UserAdapter;
  let http: HttpTestService;

  beforeEach(() => {
    const testInjector = createInjector({
      providers: [
        {
          provide: HttpService,
          useClass: HttpTestService,
        },
        {
          provide: UserAdapter,
          useClass: DefaultUserAdapter,
        },
        {
          provide: 'SCOS_BASE_URL',
          useValue: mockApiUrl,
        },
        {
          provide: JsonAPITransformerService,
          useValue: mockTransformer,
        },
        {
          provide: IdentityService,
          useClass: MockIdentityService,
        },
      ],
    });

    service = testInjector.inject(UserAdapter);
    http = testInjector.inject(HttpService) as HttpTestService;
  });

  afterEach(() => {
    vi.clearAllMocks();
    destroyInjector();
  });

  it('should be provided', () => {
    expect(service).toBeInstanceOf(DefaultUserAdapter);
  });

  describe('get', () => {
    it('should send `get` request', () => {
      service.get().subscribe();

      const mockHttpGet = vi.spyOn(http, 'get');
      expect(mockHttpGet).not.toHaveBeenCalled();
    });

    it('should call transformer data with data from response', () => {
      http.flush(mockUser);
      service.get().subscribe();

      expect(mockTransformer.do).toHaveBeenCalledWith(UserNormalizer);
    });

    it('should return transformed data', () => {
      const mockTransformerData = 'mockTransformerData';
      const callback = vi.fn();
      mockTransformer.do.mockReturnValue(() => of(mockTransformerData));

      service.get().subscribe(callback);

      expect(callback).toHaveBeenCalledWith(mockTransformerData);
    });
  });
});
