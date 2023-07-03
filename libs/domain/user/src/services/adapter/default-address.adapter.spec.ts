import { AuthIdentity, IdentityService } from '@spryker-oryx/auth';
import { HttpService, JsonAPITransformerService } from '@spryker-oryx/core';
import { HttpTestService } from '@spryker-oryx/core/testing';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import {
  mockCurrentAddress,
  mockCurrentAddressResponse,
  mockGetAddressesResponse,
} from '@spryker-oryx/user/mocks';
import { Observable, of } from 'rxjs';
import { AddressAdapter } from './address.adapter';
import { DefaultAddressAdapter } from './default-address.adapter';
import { AddressesNormalizer, AddressNormalizer } from './normalizers';

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

describe('DefaultAddressAdapter', () => {
  let service: AddressAdapter;
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
          provide: AddressAdapter,
          useClass: DefaultAddressAdapter,
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

    service = testInjector.inject(AddressAdapter);
    http = testInjector.inject(HttpService) as HttpTestService;
    identity = testInjector.inject(IdentityService) as MockIdentityService;
  });

  afterEach(() => {
    vi.clearAllMocks();
    destroyInjector();
  });

  it('should be provided', () => {
    expect(service).toBeInstanceOf(DefaultAddressAdapter);
  });

  describe('getAll should send `get` request', () => {
    describe('guest user', () => {
      it('should not call the api', () => {
        service.getList().subscribe();

        const mockHttpGet = vi.spyOn(http, 'get');
        expect(mockHttpGet).not.toHaveBeenCalled();
      });

      it('should not call transformer data with data from response', () => {
        service.getList().subscribe();

        expect(mockTransformer.transform).not.toHaveBeenCalled();
      });

      it('should return empty array', async () => {
        const callback = vi.fn();
        service.getList().subscribe(callback);
        expect(callback).toHaveBeenCalledWith([]);
      });
    });

    describe('logged in user', () => {
      beforeEach(() => {
        identity.get.mockReturnValue(of(mockUser));
      });

      it('should build url', () => {
        service.getList().subscribe();

        expect(http.url).toBe(
          `${mockApiUrl}/customers/${mockUser.userId}/addresses`
        );
      });

      it('should call transformer data with data from response', () => {
        http.flush(mockGetAddressesResponse);
        service.getList().subscribe();

        expect(mockTransformer.do).toHaveBeenCalledWith(AddressesNormalizer);
      });

      it('should return transformed data', () => {
        const mockTransformerData = 'mockTransformerData';
        const callback = vi.fn();
        mockTransformer.do.mockReturnValue(() => of(mockTransformerData));

        service.getList().subscribe(callback);

        expect(callback).toHaveBeenCalledWith(mockTransformerData);
      });
    });
  });

  describe('add should send `post` request', () => {
    describe('guest user', () => {
      it('should not call the api', () => {
        service.add(mockCurrentAddress).subscribe();

        const mockHttpPost = vi.spyOn(http, 'post');

        expect(mockHttpPost).not.toHaveBeenCalled();
      });

      it('should not call transformer data with data from response', () => {
        service.add(mockCurrentAddress).subscribe();

        expect(mockTransformer.transform).not.toHaveBeenCalled();
      });
    });

    describe('logged in user', () => {
      beforeEach(() => {
        identity.get.mockReturnValue(of(mockUser));
      });

      const mockSerializedAddressProps = {
        data: {
          type: 'addresses',
          attributes: mockCurrentAddress,
        },
      };

      it('should build url', () => {
        service.add(mockCurrentAddress).subscribe();

        expect(http.url).toBe(
          `${mockApiUrl}/customers/${mockUser.userId}/addresses`
        );
      });

      it('should provide body', () => {
        mockTransformer.serialize.mockReturnValue(
          of(mockSerializedAddressProps)
        );
        service.add(mockCurrentAddress).subscribe();

        expect(http.body).toEqual(mockSerializedAddressProps);
      });

      it('should call transformer data with data from response', () => {
        http.flush(mockCurrentAddressResponse);
        service.add(mockCurrentAddress).subscribe();

        expect(mockTransformer.do).toHaveBeenCalledWith(AddressNormalizer);
      });

      it('should return transformed data', () => {
        const mockTransformerData = 'mockTransformerData';
        const callback = vi.fn();
        mockTransformer.transform.mockReturnValue(of(mockTransformerData));

        service.add(mockCurrentAddress).subscribe(callback);

        expect(callback).toHaveBeenCalledWith(mockTransformerData);
      });
    });
  });

  describe('update should send `patch` request', () => {
    describe('guest user', () => {
      it('should not call the api', () => {
        service.update(mockCurrentAddress).subscribe();

        const mockHttpPatch = vi.spyOn(http, 'patch');

        expect(mockHttpPatch).not.toHaveBeenCalled();
      });

      it('should not call transformer data with data from response', () => {
        service.update(mockCurrentAddress).subscribe();

        expect(mockTransformer.transform).not.toHaveBeenCalled();
      });
    });

    describe('logged in user', () => {
      beforeEach(() => {
        identity.get.mockReturnValue(of(mockUser));
      });

      const mockSerializedAddressProps = {
        data: {
          type: 'addresses',
          attributes: mockCurrentAddress,
        },
      };

      it('should build url', () => {
        service.update(mockCurrentAddress).subscribe();

        expect(http.url).toBe(
          `${mockApiUrl}/customers/${mockUser.userId}/addresses/${mockCurrentAddressResponse.id}`
        );
      });

      it('should provide body', () => {
        mockTransformer.transform.mockReturnValue(
          of(mockSerializedAddressProps)
        );
        service.update(mockCurrentAddress).subscribe();

        expect(http.body).toEqual(mockSerializedAddressProps);
      });

      it('should call transformer data with data from response', () => {
        http.flush(mockCurrentAddressResponse);
        service.update(mockCurrentAddress).subscribe();

        expect(mockTransformer.do).toHaveBeenCalledWith(AddressNormalizer);
      });

      it('should return transformed data', () => {
        const mockTransformerData = 'mockTransformerData';
        const callback = vi.fn();
        mockTransformer.transform.mockReturnValue(of(mockTransformerData));

        service.update(mockCurrentAddress).subscribe(callback);

        expect(callback).toHaveBeenCalledWith(mockTransformerData);
      });
    });
  });

  describe('delete', () => {
    describe('when user is authorized', () => {
      let mockHttpDelete: any;
      const callback = vi.fn();

      beforeEach(() => {
        mockHttpDelete = vi.spyOn(http, 'delete');
        identity.get.mockReturnValue(of(mockUser));
        service.delete(mockCurrentAddress).subscribe(callback);
      });

      it('should build url', () => {
        expect(http.url).toBe(
          `${mockApiUrl}/customers/${mockUser.userId}/addresses/${mockCurrentAddress.id}`
        );
      });

      it('should call the api', () => {
        expect(mockHttpDelete).toHaveBeenCalled();
      });
    });
  });
});
