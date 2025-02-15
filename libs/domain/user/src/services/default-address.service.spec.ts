import { AuthIdentity, IdentityService } from '@spryker-oryx/auth';
import { DefaultQueryService, QueryService } from '@spryker-oryx/core';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import {
  mockCurrentAddress,
  mockNormalizedAddresses,
} from '@spryker-oryx/user/mocks';
import { Observable, Subject, firstValueFrom, mergeMap, of } from 'rxjs';
import { AddressAdapter } from './adapter';
import { AddressService } from './address.service';
import { DefaultAddressService } from './default-address.service';

class MockAddressAdapter implements Partial<AddressAdapter> {
  getList = vi.fn().mockReturnValue(of(mockNormalizedAddresses));
  update = vi.fn().mockReturnValue(of(mockCurrentAddress));
  add = vi.fn().mockReturnValue(of(mockCurrentAddress));
  delete = vi.fn().mockReturnValue(of(mockCurrentAddress));
}

const callback = vi.fn();

const mockUser: AuthIdentity = {
  userId: 'userId',
  isAuthenticated: true,
};

const mockAnonymousUser: AuthIdentity = {
  userId: 'guestid',
  isAuthenticated: false,
};

class MockIdentityService implements Partial<IdentityService> {
  get = vi
    .fn<[], Observable<AuthIdentity>>()
    .mockReturnValue(of(mockAnonymousUser));
}

describe('DefaultAddressService', () => {
  let service: AddressService;
  let adapter: MockAddressAdapter;
  let identity: MockIdentityService;

  beforeEach(() => {
    const testInjector = createInjector({
      providers: [
        {
          provide: AddressService,
          useClass: DefaultAddressService,
        },
        {
          provide: AddressAdapter,
          useClass: MockAddressAdapter,
        },
        {
          provide: IdentityService,
          useClass: MockIdentityService,
        },
        {
          provide: QueryService,
          useClass: DefaultQueryService,
        },
      ],
    });

    service = testInjector.inject(AddressService);
    adapter = testInjector.inject(
      AddressAdapter
    ) as unknown as MockAddressAdapter;
    identity = testInjector.inject(
      IdentityService
    ) as unknown as MockIdentityService;
  });

  afterEach(() => {
    vi.clearAllMocks();
    destroyInjector();
  });

  it('should be provided', () => {
    expect(service).toBeInstanceOf(DefaultAddressService);
  });

  describe('getAddresses', () => {
    it('should return an observable', () => {
      expect(service.getList()).toBeInstanceOf(Observable);
    });

    it('should get no addresses for guest user', () => {
      adapter.getList.mockReturnValue(of([]));
      service.getList().subscribe(callback);
      expect(callback).toHaveBeenCalledWith([]);
    });

    describe('logged in user', () => {
      beforeEach(() => {
        identity.get.mockReturnValue(of(mockUser));
      });

      it('should get addresses for current user and be cached when subscribed a second time', () => {
        const trigger$ = new Subject();

        trigger$.pipe(mergeMap(() => service.getList())).subscribe(callback);
        trigger$.next('');

        expect(callback).toHaveBeenNthCalledWith(1, mockNormalizedAddresses);

        trigger$.next('');

        expect(adapter.getList).toHaveBeenCalledTimes(1);
        expect(callback).toHaveBeenNthCalledWith(2, mockNormalizedAddresses);
      });
    });
  });

  describe('getAddress', () => {
    it('should return an observable', () => {
      expect(service.getList()).toBeInstanceOf(Observable);
    });

    describe('when address list is empty', () => {
      beforeEach(() => {
        identity.get.mockReturnValue(of(mockUser));
        adapter.getList.mockReturnValue(of([]));
      });

      it('should return null', () => {
        service.get('test').subscribe(callback);
        expect(callback).toHaveBeenCalledWith(null);
      });
    });

    describe('when address id is wrong', () => {
      beforeEach(() => {
        identity.get.mockReturnValue(of(mockUser));
        adapter.getList.mockReturnValue(of([mockCurrentAddress]));
      });

      it('should return null', () => {
        service.get('test').subscribe(callback);
        expect(callback).toHaveBeenCalledWith(null);
      });
    });

    describe('when address id is correct', () => {
      beforeEach(() => {
        identity.get.mockReturnValue(of(mockUser));
        adapter.getList.mockReturnValue(of([mockCurrentAddress]));
      });

      it('should return null', () => {
        service.get(mockCurrentAddress.id as string).subscribe(callback);
        expect(callback).toHaveBeenCalledWith(mockCurrentAddress);
      });
    });
  });

  describe('getCurrentAddress', () => {
    it('should return an observable', () => {
      expect(service.getCurrent()).toBeInstanceOf(Observable);
    });

    it('should get no address for a guest user', async () => {
      adapter.getList.mockReturnValue(of([]));
      const result = await firstValueFrom(service.getCurrent());

      expect(result).toEqual(null);
    });

    describe('logged in user', () => {
      beforeEach(() => {
        identity.get.mockReturnValue(of(mockUser));
      });

      it('should get addresses for current user and be cached when subscribed a second time', () => {
        const trigger$ = new Subject();

        trigger$.pipe(mergeMap(() => service.getCurrent())).subscribe(callback);

        trigger$.next('');

        expect(callback).toHaveBeenNthCalledWith(1, mockCurrentAddress);

        trigger$.next('');

        expect(adapter.getList).toHaveBeenCalledTimes(1);
        expect(callback).toHaveBeenNthCalledWith(2, mockCurrentAddress);
      });
    });
  });

  describe('addAddress', () => {
    it('should return an observable', () => {
      expect(service.add(mockCurrentAddress)).toBeInstanceOf(Observable);
    });

    it('should add address', () => {
      service.add(mockCurrentAddress).subscribe(callback);

      expect(adapter.add).toHaveBeenCalledWith(mockCurrentAddress);
    });
  });

  describe('updateAddress', () => {
    it('should return an observable', () => {
      expect(service.update(mockCurrentAddress)).toBeInstanceOf(Observable);
    });

    it('should update address', () => {
      service.update(mockCurrentAddress).subscribe(callback);

      expect(adapter.update).toHaveBeenCalledWith(mockCurrentAddress);
    });
  });

  describe('deleteAddress', () => {
    it('should return an observable', () => {
      expect(service.delete(mockCurrentAddress)).toBeInstanceOf(Observable);
    });
  });
});
