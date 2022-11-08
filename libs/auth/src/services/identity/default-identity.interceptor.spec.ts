import { HttpInterceptor } from '@spryker-oryx/core';
import { createInjector, destroyInjector } from '@spryker-oryx/injector';
import { of } from 'rxjs';
import { AuthHeaderTypes } from '../../models';
import { DefaultIdentityInterceptor } from './default-identity.interceptor';
import { IdentityInterceptor, IdentityService } from './identity.service';

class MockIdentityService implements Partial<IdentityService> {
  get = vi.fn();
}

const mockUrl = 'mockUrl';
const mockHandleResult = 'mockHandleResult';
const mockHandle = vi.fn();
const callback = vi.fn();

describe('DefaultIdentityInterceptor', () => {
  let interceptor: HttpInterceptor;
  let identity: MockIdentityService;

  beforeEach(() => {
    const testInjector = createInjector({
      providers: [
        {
          provide: IdentityInterceptor,
          useClass: DefaultIdentityInterceptor,
        },
        {
          provide: IdentityService,
          useClass: MockIdentityService,
        },
      ],
    });

    identity = testInjector.inject(IdentityService) as MockIdentityService;
    interceptor = testInjector.inject(IdentityInterceptor);
    mockHandle.mockReturnValue(of(mockHandleResult));
  });

  afterEach(() => {
    vi.resetAllMocks();
    destroyInjector();
  });

  describe('when identity data does not have token information', () => {
    it('should provide correct headers for guest user', () => {
      const mockIdentity = {
        id: 'mockId',
      };
      const mockOptions = {};
      identity.get.mockReturnValue(of(mockIdentity));
      interceptor
        .intercept(mockUrl, mockOptions, mockHandle)
        .subscribe(callback);
      expect(mockHandle).toHaveBeenCalledWith(mockUrl, {
        headers: {
          [AuthHeaderTypes.AnonymousCustomerUniqueId]: mockIdentity.id,
        },
      });
      expect(callback).toHaveBeenCalledWith(mockHandleResult);
    });
  });

  describe('when identity data has token information', () => {
    it('should provide headers for loggedIn user', () => {
      const mockIdentity = {
        token: {
          tokenType: 'mockTokenType',
          accessToken: 'mockTokenAccess',
        },
      };
      const mockOptions = {};
      identity.get.mockReturnValue(of(mockIdentity));
      interceptor
        .intercept(mockUrl, mockOptions, mockHandle)
        .subscribe(callback);
      expect(mockHandle).toHaveBeenCalledWith(mockUrl, {
        headers: {
          [AuthHeaderTypes.Authorization]: `${mockIdentity.token.tokenType} ${mockIdentity.token.accessToken}`,
        },
      });
      expect(callback).toHaveBeenCalledWith(mockHandleResult);
    });
  });
});
