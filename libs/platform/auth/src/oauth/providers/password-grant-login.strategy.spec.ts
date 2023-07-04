import { AuthLoginStrategy } from '@spryker-oryx/auth/login';
import { createInjector, destroyInjector, getInjector } from '@spryker-oryx/di';
import { OauthService } from '../oauth.service';
import {
  PasswordGrantAuthLoginStrategy,
  PasswordGrantAuthLoginStrategyConfig,
} from './password-grant-login.strategy';

const mockOauthService = {
  loginWith: vi.fn(),
};

const mockConfig = {
  defaultProviderId: 'mockDefaultProviderId',
};

describe('PasswordGrantAuthLoginStrategy', () => {
  let service: AuthLoginStrategy;

  beforeEach(() => {
    vi.stubGlobal('location', { assign: vi.fn() });

    createInjector({
      providers: [
        {
          provide: OauthService,
          useValue: mockOauthService,
        },
        {
          provide: PasswordGrantAuthLoginStrategyConfig,
          useValue: mockConfig,
        },
        {
          provide: AuthLoginStrategy,
          useClass: PasswordGrantAuthLoginStrategy,
        },
      ],
    });

    service = getInjector().inject(AuthLoginStrategy);
  });

  afterEach(() => {
    vi.resetAllMocks();
    vi.unstubAllGlobals();
    destroyInjector();
  });

  describe('login', () => {
    it('should call OauthService.loginWith with proper params', () => {
      service.login({
        email: 'mockEmail',
        password: 'mockPassword',
        rememberMe: false,
      });
      expect(mockOauthService.loginWith).toHaveBeenCalledWith(
        mockConfig.defaultProviderId,
        { username: 'mockEmail', password: 'mockPassword' }
      );
    });
  });

  describe('setProviderId', () => {
    it('should set new provider id', () => {
      (service as PasswordGrantAuthLoginStrategy).setProviderId('newProvider');
      service.login({
        email: 'mockEmail',
        password: 'mockPassword',
        rememberMe: false,
      });
      expect(mockOauthService.loginWith).toHaveBeenCalledWith('newProvider', {
        username: 'mockEmail',
        password: 'mockPassword',
      });
    });
  });

  describe('resetProviderId', () => {
    it('should reset reset provider id to default value', () => {
      (service as PasswordGrantAuthLoginStrategy).setProviderId('newProvider');
      (service as PasswordGrantAuthLoginStrategy).resetProviderId();
      service.login({
        email: 'mockEmail',
        password: 'mockPassword',
        rememberMe: false,
      });
      expect(mockOauthService.loginWith).toHaveBeenCalledWith(
        mockConfig.defaultProviderId,
        {
          username: 'mockEmail',
          password: 'mockPassword',
        }
      );
    });
  });
});
