import { AuthIdentity, IdentityService } from '@spryker-oryx/auth';
import { HttpService, JsonAPITransformerService } from '@spryker-oryx/core';
import { HttpTestService } from '@spryker-oryx/core/testing';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { Observable, of } from 'rxjs';
import { DefaultOrderAdapter } from './default-order.adapter';
import { OrderNormalizer } from './normalizers';
import { OrderAdapter } from './order.adapter';

const mockApiUrl = 'mockApiUrl';

const mockAnonymousUser: AuthIdentity = {
  userId: 'userId',
  isAuthenticated: false,
};

const mockUser: AuthIdentity = {
  userId: 'userId',
  isAuthenticated: true,
};

const mockGetOrderProps = { id: 'mockid' };

const mockTransformer = {
  transform: vi.fn().mockReturnValue(of(null)),
  do: vi.fn().mockReturnValue(() => of(null)),
};

class MockIdentityService implements Partial<IdentityService> {
  get = vi
    .fn<[], Observable<AuthIdentity>>()
    .mockReturnValue(of(mockAnonymousUser));
}

describe('DefaultOrderAdapter', () => {
  let service: OrderAdapter;
  let http: HttpTestService;
  let identity: MockIdentityService;

  beforeEach(() => {
    const testInjector = createInjector({
      providers: [
        {
          provide: HttpService,
          useClass: HttpTestService,
        },
        {
          provide: OrderAdapter,
          useClass: DefaultOrderAdapter,
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

    service = testInjector.inject(OrderAdapter);
    http = testInjector.inject(HttpService) as HttpTestService;
    identity = testInjector.inject(IdentityService) as MockIdentityService;
  });

  afterEach(() => {
    vi.clearAllMocks();
    destroyInjector();
  });

  it('should be provided', () => {
    expect(service).toBeInstanceOf(DefaultOrderAdapter);
  });

  describe('when get is called', () => {
    describe('and user is a guest', () => {
      it('should not call API', () => {
        service.get(mockGetOrderProps).subscribe();

        expect(mockTransformer.do).not.toHaveBeenCalled();
      });
    });

    describe('and user is logged in', () => {
      beforeEach(() => {
        identity.get.mockReturnValue(of(mockUser));
      });

      it('should build url', () => {
        service.get(mockGetOrderProps).subscribe();

        expect(http.url).toBe(`${mockApiUrl}/orders/mockid`);
      });

      it('should call transformer data with data from response', () => {
        service.get(mockGetOrderProps).subscribe();

        expect(mockTransformer.do).toHaveBeenCalledWith(OrderNormalizer);
      });

      it('should return transformed data', () => {
        const mockTransformerData = 'mockTransformerData';
        const callback = vi.fn();
        mockTransformer.do.mockReturnValue(() => of(mockTransformerData));

        service.get(mockGetOrderProps).subscribe(callback);

        expect(callback).toHaveBeenCalledWith(mockTransformerData);
      });
    });
  });
});
