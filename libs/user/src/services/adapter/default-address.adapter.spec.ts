import { IdentityService } from '@spryker-oryx/auth';
import {
  HttpService,
  JsonAPITransformerService,
  StorageService,
  StorageType,
} from '@spryker-oryx/core';
import { HttpTestService } from '@spryker-oryx/core/testing';
import { createInjector, destroyInjector } from '@spryker-oryx/injector';
import {
  mockAddress,
  mockCurrentAddress,
  mockCurrentAddressResponse,
  mockGetAddressesResponse,
} from '@spryker-oryx/user/mocks';
import { of } from 'rxjs';
import { AddressAdapter } from './address.adapter';
import { DefaultAddressAdapter } from './default-address.adapter';
import { AddressesNormalizers, AddressNormalizers } from './normalizers';

const mockApiUrl = 'mockApiUrl';

const mockAnonymousUser = {
  id: 'userId',
  anonymous: true,
};

const mockUser = {
  id: 'userId',
  anonymous: false,
  token: { accessToken: 'token' },
};

class MockStorageService implements Partial<StorageService> {
  get = vi.fn();
  set = vi.fn();
  remove = vi.fn();
}

const mockTransformer = {
  transform: vi.fn().mockReturnValue(of(null)),
  do: vi.fn().mockReturnValue(() => of(null)),
  serialize: vi.fn().mockReturnValue(of(null)),
};

class MockIdentityService implements Partial<IdentityService> {
  get = vi.fn().mockReturnValue(of(mockAnonymousUser));
}

describe('DefaultAddressAdapter', () => {
  let service: AddressAdapter;
  let http: HttpTestService;
  let identity: MockIdentityService;
  let storage: MockStorageService;

  beforeEach(() => {
    const testInjector = createInjector({
      providers: [
        {
          provide: HttpService,
          useClass: HttpTestService,
        },
        {
          provide: StorageService,
          useClass: MockStorageService,
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
    storage = testInjector.inject(
      StorageService
    ) as unknown as MockStorageService;
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
      beforeEach(() => {
        storage.get.mockReturnValue(of(null));
      });
      it('should not call the api', () => {
        service.getAll().subscribe();

        const mockHttpGet = vi.spyOn(http, 'get');
        expect(mockHttpGet).not.toHaveBeenCalled();
      });

      it('should not call transformer data with data from response', () => {
        service.getAll().subscribe();

        expect(mockTransformer.transform).not.toHaveBeenCalled();
      });

      it('should return empty array', () => {
        const mockTransformerData = 'mockTransformerData';
        const callback = vi.fn();
        mockTransformer.transform.mockReturnValue(of(mockTransformerData));

        service.getAll().subscribe(callback);

        expect(callback).toHaveBeenCalledWith([]);
        expect(storage.get).toHaveBeenCalledWith(
          'address',
          StorageType.SESSION
        );
      });
    });

    describe('logged in user', () => {
      beforeEach(() => {
        identity.get.mockReturnValue(of(mockUser));
      });

      it('should not call storage', () => {
        service.getAll().subscribe();

        expect(storage.get).not.toHaveBeenCalled();
      });

      it('should build url', () => {
        service.getAll().subscribe();

        expect(http.url).toBe(
          `${mockApiUrl}/customers/${mockUser.id}/addresses`
        );
      });

      it('should call transformer data with data from response', () => {
        http.flush(mockGetAddressesResponse);
        service.getAll().subscribe();

        expect(mockTransformer.do).toHaveBeenCalledWith(AddressesNormalizers);
      });

      it('should return transformed data', () => {
        const mockTransformerData = 'mockTransformerData';
        const callback = vi.fn();
        mockTransformer.do.mockReturnValue(() => of(mockTransformerData));

        service.getAll().subscribe(callback);

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

      it('should return the address with default billing and shipping enabled and save to storage', () => {
        const mockTransformerData = 'mockTransformerData';
        const callback = vi.fn();
        mockTransformer.transform.mockReturnValue(of(mockTransformerData));

        service.add(mockAddress).subscribe(callback);

        const expectedMockAddress = {
          ...mockAddress,
          isDefaultBilling: true,
          isDefaultShipping: true,
        };

        expect(callback).toHaveBeenCalledWith(expectedMockAddress);
        expect(storage.set).toHaveBeenCalledWith(
          'address',
          expectedMockAddress,
          StorageType.SESSION
        );
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

      it('should not call storage', () => {
        service.add(mockCurrentAddress).subscribe();

        expect(storage.set).not.toHaveBeenCalled();
      });

      it('should build url', () => {
        service.add(mockCurrentAddress).subscribe();

        expect(http.url).toBe(
          `${mockApiUrl}/customers/${mockUser.id}/addresses`
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

        expect(mockTransformer.do).toHaveBeenCalledWith(AddressNormalizers);
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

      it('should return the original address', () => {
        const mockTransformerData = 'mockTransformerData';
        const callback = vi.fn();
        mockTransformer.transform.mockReturnValue(of(mockTransformerData));

        service.update(mockCurrentAddress).subscribe(callback);

        expect(callback).toHaveBeenCalledWith(mockCurrentAddress);
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
          `${mockApiUrl}/customers/${mockUser.id}/addresses/${mockCurrentAddressResponse.id}`
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

        expect(mockTransformer.do).toHaveBeenCalledWith(AddressNormalizers);
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
});
