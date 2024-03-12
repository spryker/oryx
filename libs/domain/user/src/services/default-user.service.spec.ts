import { AuthIdentity, IdentityService } from '@spryker-oryx/auth';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { Observable, Subject, mergeMap, of } from 'rxjs';
import { UserAdapter } from './adapter';
import { DefaultUserService } from './default-user.service';
import { UserService } from './user.service';

const mockUser = {
  firstName: 'firstName',
  lastName: 'lastName',
};

const callback = vi.fn();

const mockLoggedUser: AuthIdentity = {
  userId: 'userId',
  isAuthenticated: true,
};

const mockAnonymousUser: AuthIdentity = {
  userId: 'guestid',
  isAuthenticated: false,
};

class MockUserAdapter implements Partial<UserAdapter> {
  get = vi.fn().mockReturnValue(of(mockUser));
}

const mockIdentityMethods = {
  get: vi
    .fn<[], Observable<AuthIdentity>>()
    .mockReturnValue(of(mockAnonymousUser)),
};

class MockIdentityService implements Partial<IdentityService> {
  get = mockIdentityMethods.get;
}

describe('DefaultUserService', () => {
  let service: UserService;
  let adapter: MockUserAdapter;
  let identity: MockIdentityService;

  const mockInjector = () => {
    const testInjector = createInjector({
      providers: [
        {
          provide: UserAdapter,
          useClass: MockUserAdapter,
        },
        {
          provide: UserService,
          useClass: DefaultUserService,
        },
        {
          provide: IdentityService,
          useClass: MockIdentityService,
        },
      ],
    });

    service = testInjector.inject(UserService);
    adapter = testInjector.inject(UserAdapter) as MockUserAdapter;
    identity = testInjector.inject(IdentityService) as MockIdentityService;
  };

  beforeEach(() => {
    mockInjector();
  });

  afterEach(() => {
    vi.clearAllMocks();
    destroyInjector();
  });

  it('should be provided', () => {
    expect(service).toBeInstanceOf(DefaultUserService);
  });

  describe('getUser', () => {
    it('should return an observable', () => {
      expect(service.getUser()).toBeInstanceOf(Observable);
    });

    it('should get no userData for guest user', () => {
      service.getUser().subscribe(callback);

      expect(callback).toHaveBeenCalledWith(null);
      expect(adapter.get).not.toHaveBeenCalled();
    });

    describe('logged in user', () => {
      beforeEach(() => {
        destroyInjector();

        mockIdentityMethods.get.mockReturnValue(of(mockLoggedUser));

        mockInjector();
      });

      it('should get current user data and be cached when subscribed a second time', () => {
        const trigger$ = new Subject();

        trigger$.pipe(mergeMap(() => service.getUser())).subscribe(callback);
        trigger$.next('');

        expect(callback).toHaveBeenNthCalledWith(1, mockUser);

        trigger$.next('');

        expect(adapter.get).toHaveBeenCalledTimes(1);
        expect(callback).toHaveBeenNthCalledWith(2, mockUser);
      });
    });
  });

  describe('getLoadingState', () => {
    beforeEach(() => {
      service.getLoadingState().subscribe(callback);
    });

    it('should return current state', () => {
      expect(callback).toHaveBeenCalledWith(false);
    });
  });
});
