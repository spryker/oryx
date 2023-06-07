import { StorageService, StorageType } from '@spryker-oryx/core';
import { createInjector, destroyInjector, getInjector } from '@spryker-oryx/di';
import { of, throwError } from 'rxjs';
import { AnonAuthTokenService } from './anon-auth-token.service';
import { AuthTokenService } from './auth-token.service';
import { AuthService } from './auth.service';

const mockAuthTokenService = {
  getToken: vi.fn(),
};

const mockAuthService = {
  isAuthenticated: vi.fn(),
};

const mockStorageService = {
  remove: vi.fn(),
  get: vi.fn(),
  set: vi.fn(),
};

const mockUtil = {
  generateID: vi.fn(),
};

vi.mock('./utils', () => ({
  generateID: (data: unknown) => mockUtil.generateID(data),
}));

describe('AnonAuthTokenService', () => {
  beforeEach(() => {
    createInjector({
      providers: [
        {
          provide: AuthTokenService,
          useValue: mockAuthTokenService,
        },
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        {
          provide: StorageService,
          useValue: mockStorageService,
        },
        {
          provide: AnonAuthTokenService,
          useClass: AnonAuthTokenService,
        },
      ],
    });
  });

  afterEach(() => {
    vi.resetAllMocks();
    destroyInjector();
  });

  describe('getToken', () => {
    it('should clear anon token from storage if error has not occurred', () => {
      mockAuthService.isAuthenticated.mockReturnValue(of(null));
      mockAuthTokenService.getToken.mockReturnValue(of(null));
      mockStorageService.remove.mockReturnValue(of(null));
      getInjector().inject(AnonAuthTokenService).getToken().subscribe();
      expect(mockAuthService.isAuthenticated).toHaveBeenCalled();
      expect(mockAuthTokenService.getToken).toHaveBeenCalled();
      expect(mockStorageService.remove).toHaveBeenCalledWith(
        'oryx.anonymous-user',
        StorageType.Session
      );
    });

    it('should get anon token from storage if error has occurred', () => {
      mockAuthService.isAuthenticated.mockReturnValue(of(null));
      mockAuthTokenService.getToken.mockReturnValue(
        throwError(() => new Error(''))
      );
      mockStorageService.get.mockReturnValue(of('mockToken'));
      const callback = vi.fn();
      getInjector().inject(AnonAuthTokenService).getToken().subscribe(callback);
      expect(mockAuthService.isAuthenticated).toHaveBeenCalled();
      expect(mockAuthTokenService.getToken).toHaveBeenCalled();
      expect(mockStorageService.get).toHaveBeenCalledWith(
        'oryx.anonymous-user',
        StorageType.Session
      );
      expect(callback).toHaveBeenCalledWith({
        type: 'anon',
        token: 'mockToken',
      });
    });

    it('should set anon token to storage if error has occurred and token is not exist', () => {
      mockAuthService.isAuthenticated.mockReturnValue(of(null));
      mockAuthTokenService.getToken.mockReturnValue(
        throwError(() => new Error(''))
      );
      mockStorageService.get.mockReturnValue(of(null));
      mockStorageService.set.mockReturnValue(of(null));
      mockUtil.generateID.mockReturnValue('mockGeneratedID');
      const callback = vi.fn();
      getInjector().inject(AnonAuthTokenService).getToken().subscribe(callback);
      expect(mockAuthService.isAuthenticated).toHaveBeenCalled();
      expect(mockAuthTokenService.getToken).toHaveBeenCalled();
      expect(mockStorageService.get).toHaveBeenCalledWith(
        'oryx.anonymous-user',
        StorageType.Session
      );
      expect(mockStorageService.set).toHaveBeenCalledWith(
        'oryx.anonymous-user',
        'mockGeneratedID',
        StorageType.Session
      );
      expect(callback).toHaveBeenCalledWith({
        type: 'anon',
        token: 'mockGeneratedID',
      });
    });
  });
});
