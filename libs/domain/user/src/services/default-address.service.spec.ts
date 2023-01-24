import { IdentityService } from '@spryker-oryx/auth';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import {
  mockCurrentAddress,
  mockNormalizedAddresses,
} from '@spryker-oryx/user/mocks';
import { firstValueFrom, mergeMap, Observable, of, Subject } from 'rxjs';
import { AddressAdapter } from './adapter';
import { AddressService } from './address.service';
import { DefaultAddressService } from './default-address.service';

class MockAddressAdapter implements Partial<AddressAdapter> {
  getAll = vi.fn().mockReturnValue(of(mockNormalizedAddresses));
  update = vi.fn().mockReturnValue(of(mockCurrentAddress));
  add = vi.fn().mockReturnValue(of(mockCurrentAddress));
  delete = vi.fn().mockReturnValue(of(mockCurrentAddress));
}

const callback = vi.fn();

const mockUser = {
  id: 'userId',
  anonymous: false,
};

const mockAnonymousUser = {
  id: 'guestid',
  anonymous: true,
};

class MockIdentityService implements Partial<IdentityService> {
  get = vi.fn().mockReturnValue(of(mockAnonymousUser));
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
      expect(service.getAddresses()).toBeInstanceOf(Observable);
    });

    it('should get no addresses for guest user', () => {
      adapter.getAll.mockReturnValue(of([]));
      service.getAddresses().subscribe(callback);
      expect(callback).toHaveBeenCalledWith([]);
    });

    describe('logged in user', () => {
      beforeEach(() => {
        identity.get.mockReturnValue(of(mockUser));
      });

      it('should get addresses for current user and be cached when subscribed a second time', () => {
        const trigger$ = new Subject();

        trigger$
          .pipe(mergeMap(() => service.getAddresses()))
          .subscribe(callback);
        trigger$.next('');

        expect(callback).toHaveBeenNthCalledWith(1, mockNormalizedAddresses);

        trigger$.next('');

        expect(adapter.getAll).toHaveBeenCalledTimes(1);
        expect(callback).toHaveBeenNthCalledWith(2, mockNormalizedAddresses);
      });
    });
  });

  describe('getAddress', () => {
    it('should return an observable', () => {
      expect(service.getAddresses()).toBeInstanceOf(Observable);
    });

    describe('when address list is empty', () => {
      beforeEach(() => {
        identity.get.mockReturnValue(of(mockUser));
        adapter.getAll.mockReturnValue(of([]));
      });

      it('should return null', () => {
        service.getAddress('test').subscribe(callback);
        expect(callback).toHaveBeenCalledWith(null);
      });
    });

    describe('when address id is wrong', () => {
      beforeEach(() => {
        identity.get.mockReturnValue(of(mockUser));
        adapter.getAll.mockReturnValue(of([mockCurrentAddress]));
      });

      it('should return null', () => {
        service.getAddress('test').subscribe(callback);
        expect(callback).toHaveBeenCalledWith(null);
      });
    });

    describe('when address id is correct', () => {
      beforeEach(() => {
        identity.get.mockReturnValue(of(mockUser));
        adapter.getAll.mockReturnValue(of([mockCurrentAddress]));
      });

      it('should return null', () => {
        service.getAddress(mockCurrentAddress.id as string).subscribe(callback);
        expect(callback).toHaveBeenCalledWith(mockCurrentAddress);
      });
    });
  });

  describe('getCurrentAddress', () => {
    it('should return an observable', () => {
      expect(service.getCurrentAddress()).toBeInstanceOf(Observable);
    });

    it('should get no address for a guest user', async () => {
      adapter.getAll.mockReturnValue(of([]));
      const result = await firstValueFrom(service.getCurrentAddress());

      expect(result).toEqual(null);
    });

    describe('logged in user', () => {
      beforeEach(() => {
        identity.get.mockReturnValue(of(mockUser));
      });

      it('should get addresses for current user and be cached when subscribed a second time', () => {
        const trigger$ = new Subject();

        trigger$
          .pipe(mergeMap(() => service.getCurrentAddress()))
          .subscribe(callback);

        trigger$.next('');

        expect(callback).toHaveBeenNthCalledWith(1, mockCurrentAddress);

        trigger$.next('');

        expect(adapter.getAll).toHaveBeenCalledTimes(1);
        expect(callback).toHaveBeenNthCalledWith(2, mockCurrentAddress);
      });
    });
  });

  describe('addAddress', () => {
    it('should return an observable', () => {
      expect(service.addAddress(mockCurrentAddress)).toBeInstanceOf(Observable);
    });

    it('should add address', () => {
      service.addAddress(mockCurrentAddress).subscribe(callback);

      expect(adapter.add).toHaveBeenCalledWith(mockCurrentAddress);
    });
  });

  describe('updateAddress', () => {
    it('should return an observable', () => {
      expect(service.updateAddress(mockCurrentAddress)).toBeInstanceOf(
        Observable
      );
    });

    it('should update address', () => {
      service.updateAddress(mockCurrentAddress).subscribe(callback);

      expect(adapter.update).toHaveBeenCalledWith(mockCurrentAddress);
    });
  });

  describe('deleteAddress', () => {
    it('should return an observable', () => {
      expect(service.deleteAddress(mockCurrentAddress)).toBeInstanceOf(
        Observable
      );
    });
  });
});
