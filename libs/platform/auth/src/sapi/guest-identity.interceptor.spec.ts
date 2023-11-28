import { createInjector, destroyInjector, getInjector } from '@spryker-oryx/di';
import { of } from 'rxjs';
import { IdentityService } from '../services/identity.service';
import {
  GuestIdentityInterceptor,
  GuestIdentityInterceptorConfig,
} from './guest-identity.interceptor';

const mockIdentityService = {
  get: vi.fn(),
};

const mockConfig: Record<string, string> = {
  headerName: 'mockHeaderName',
};

describe('GuestIdentityInterceptor', () => {
  let service: GuestIdentityInterceptor;

  beforeEach(() => {
    createInjector({
      providers: [
        {
          provide: IdentityService,
          useValue: mockIdentityService,
        },
        {
          provide: GuestIdentityInterceptorConfig,
          useValue: mockConfig,
        },
        {
          provide: GuestIdentityInterceptor,
          useClass: GuestIdentityInterceptor,
        },
      ],
    });

    service = getInjector().inject(GuestIdentityInterceptor);
  });

  afterEach(() => {
    vi.resetAllMocks();
    vi.unstubAllGlobals();
    destroyInjector();
  });

  describe('intercept', () => {
    it('should add new headers', () => {
      const mockHeaders = {
        set: vi.fn(),
      };
      const mockRequestMethods = {
        clone: () => ({ headers: mockHeaders }),
      };
      const mockRequest = vi.fn().mockReturnValue(mockRequestMethods);
      vi.stubGlobal('Request', mockRequest);
      const headers = { param1: 'value1' };
      const mockHandle = vi.fn().mockReturnValue(of(null));
      mockIdentityService.get.mockReturnValue(
        of({
          isAuthenticated: false,
          userId: 'mockUserId',
        })
      );
      service
        .intercept(
          new Request('http://mockurl', {
            body: 'value1',
            method: 'POST',
            headers,
          }),
          mockHandle
        )
        .subscribe();
      expect(mockIdentityService.get).toHaveBeenCalled();
      expect(mockHeaders.set).toHaveBeenCalledWith(
        mockConfig.headerName,
        'mockUserId'
      );
    });

    it('should not add new headers if user is authenticated', () => {
      const mockHeaders = {
        set: vi.fn(),
      };
      const mockRequestMethods = {
        clone: () => ({ headers: mockHeaders }),
      };
      const mockRequest = vi.fn().mockReturnValue(mockRequestMethods);
      vi.stubGlobal('Request', mockRequest);
      const headers = { param1: 'value1' };
      const mockHandle = vi.fn().mockReturnValue(of(null));
      mockIdentityService.get.mockReturnValue(
        of({
          isAuthenticated: true,
          userId: 'mockUserId',
        })
      );
      service
        .intercept(
          new Request('mockUrl', { body: 'value1', method: 'POST', headers }),
          mockHandle
        )
        .subscribe();
      expect(mockHeaders.set).not.toHaveBeenCalled();
    });

    it('should call handle with options with generated headers', () => {
      const headers = { param1: 'value1' };
      const mockUrl = 'mockUrl';
      const mockOptions = { body: 'value1', method: 'POST', headers };
      const mockHandle = vi.fn().mockReturnValue(of(null));
      const mockHeaders = {
        set: vi.fn(),
      };
      const mockRequestMethods = {
        clone: () => ({ headers: mockHeaders }),
      };
      const mockRequest = vi.fn().mockReturnValue(mockRequestMethods);
      vi.stubGlobal('Request', mockRequest);
      mockIdentityService.get.mockReturnValue(
        of({
          isAuthenticated: false,
          userId: 'mockUserId',
        })
      );
      service
        .intercept(new Request(mockUrl, mockOptions), mockHandle)
        .subscribe();
      expect(mockHandle).toHaveBeenCalledWith({ headers: mockHeaders });
    });
  });

  describe('shouldInterceptRequest', () => {
    it('should check if base url exist', () => {
      expect(
        service.shouldInterceptRequest(new Request('http://url/additional'))
      ).toBe(true);
      mockConfig.baseUrl = 'http://url';
      expect(
        service.shouldInterceptRequest(new Request('http://url/additional'))
      ).toBe(true);
      expect(
        service.shouldInterceptRequest(new Request('http://noMatch/additional'))
      ).toBe(false);
    });
  });
});
