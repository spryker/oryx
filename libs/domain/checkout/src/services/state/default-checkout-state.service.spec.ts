import { IdentityService } from '@spryker-oryx/auth';
import { StorageService, StorageType } from '@spryker-oryx/core';
import { createInjector, destroyInjector, Injector } from '@spryker-oryx/di';
import { BehaviorSubject, of, take } from 'rxjs';
import {
  checkoutDataStorageKey,
  ContactDetails,
  PlaceOrderData,
} from '../../models';
import { CheckoutStateService, DefaultCheckoutStateService } from './';

class MockStorageService implements Partial<StorageService> {
  get = vi.fn().mockReturnValue(of());
  set = vi.fn();
  clear = vi.fn().mockReturnValue(of());
  remove = vi.fn();
}

class MockIdentityService implements Partial<IdentityService> {
  mockIdentity = new BehaviorSubject({} as any);
  get = vi.fn().mockReturnValue(this.mockIdentity);
}

describe('DefaultCheckoutStateService', () => {
  let injector: Injector;
  let checkoutStateService: CheckoutStateService;
  let storageService: StorageService;

  beforeEach(() => {
    injector = createInjector({
      providers: [
        {
          provide: CheckoutStateService,
          useClass: DefaultCheckoutStateService,
        },
        { provide: StorageService, useClass: MockStorageService },
        { provide: IdentityService, useClass: MockIdentityService },
      ],
    });

    storageService = injector.inject<MockStorageService>(StorageService);
    checkoutStateService = injector.inject(CheckoutStateService);
  });

  afterEach(() => {
    vi.clearAllMocks();
    destroyInjector();
  });

  describe('when the service is provided', () => {
    it('should be an instance of DefaultCheckoutStateService', () => {
      expect(checkoutStateService).toBeInstanceOf(DefaultCheckoutStateService);
    });

    it('should restore data from the storage service', () => {
      expect(storageService.get).toHaveBeenCalled();
    });

    it('isInvalid should return false', () => {
      let data: boolean | undefined;
      checkoutStateService
        .isInvalid()
        .subscribe((response) => (data = response));
      expect(data).toBe(false);
    });
  });

  describe('when the checkout state is not set before', () => {
    let result: ContactDetails | null | undefined;

    describe('and the set() method is used', () => {
      beforeEach(() => {
        checkoutStateService
          .get('customer')
          .subscribe((response) => (result = response));
      });

      it('should return null', () => {
        expect(result).toBe(null);
      });
    });
  });

  describe('when the checkout state is set', () => {
    const mockCustomerData = { email: 'foo@bar.com' };

    beforeEach(() => {
      checkoutStateService.set('customer', {
        valid: true,
        value: mockCustomerData,
      });
    });

    it('should store data to the session storage', () => {
      expect(storageService.set).toHaveBeenCalledWith(
        checkoutDataStorageKey,
        expect.anything(),
        StorageType.Session
      );
    });

    it('should resolve the data using get()', () => {
      let data;
      checkoutStateService
        .get('customer')
        .pipe(take(1))
        .subscribe((result) => (data = result));
      expect(data).toBe(mockCustomerData);
    });

    describe('and when the data is cleared', () => {
      beforeEach(() => {
        checkoutStateService.clear();
      });

      it('should remove the data from storage', () => {
        expect(storageService.remove).toBeCalledWith(
          checkoutDataStorageKey,
          StorageType.Session
        );
      });
    });
  });

  describe('when getAll() is called', () => {
    describe('and some of the data is invalid', () => {
      let data: Partial<PlaceOrderData> | null;
      beforeEach(() => {
        checkoutStateService.set('customer', {
          valid: true,
          value: { email: 'foo@bar.com' },
        });
        checkoutStateService.set('payments', {
          valid: true,
          value: [{ id: 'p', name: 'P', provider: 'ppp' }],
        });
        checkoutStateService.set('shipment', {
          valid: false,
          value: { idShipmentMethod: 'foo' },
        });
      });

      it('should return null', () => {
        checkoutStateService
          .getAll()
          .subscribe((response) => (data = response));
        expect(data).toBeNull();
      });

      it('isInvalid should return true', () => {
        let data: boolean | undefined;
        checkoutStateService.getAll().subscribe();
        checkoutStateService
          .isInvalid()
          .subscribe((response) => (data = response));
        expect(data).toBe(true);
      });
    });

    describe('and the all the data is valid', () => {
      let data: Partial<PlaceOrderData> | null;
      beforeEach(() => {
        checkoutStateService.set('customer', {
          valid: true,
          value: { email: 'foo@bar.com' },
        });
        checkoutStateService.set('shippingAddress', {
          valid: true,
          value: { salutation: 'Mr', firstName: 'John', lastName: 'Doe' },
        });
        checkoutStateService.set('payments', {
          valid: true,
          value: [{ id: 'p', name: 'P', provider: 'ppp' }],
        });
      });

      it('should expose all checkout state in an object', () => {
        checkoutStateService
          .getAll()
          .subscribe((response) => (data = response));
        expect(data).not.toBeNull();
      });

      it('should populate the salutation from the shipping address', () => {
        expect(data?.customer?.salutation).toBe('Mr');
      });

      it('should populate the name from the shipping address', () => {
        expect(data?.customer?.firstName).toBe('John');
        expect(data?.customer?.lastName).toBe('Doe');
      });

      it('isInvalid should return false', () => {
        let data: boolean | undefined;
        checkoutStateService
          .isInvalid()
          .subscribe((response) => (data = response));
        expect(data).toBe(false);
      });
    });
  });

  describe('when the user changes', () => {
    let mockIdentityService: MockIdentityService;
    const mockCustomerData = { email: 'foo@bar.com' };

    beforeEach(() => {
      mockIdentityService =
        injector.inject<MockIdentityService>(IdentityService);
      mockIdentityService.mockIdentity.next({ userId: 'user1' });
      checkoutStateService.set('customer', {
        valid: true,
        value: mockCustomerData,
      });
    });

    it('should reset the checkout state', () => {
      let data;
      // simulate user change
      mockIdentityService.mockIdentity.next({ userId: 'user2' });

      // get the checkout state after user change
      checkoutStateService
        .get('customer')
        .pipe(take(1))
        .subscribe((result) => (data = result));

      // checkout state should have been reset
      expect(data).toBeNull();
    });

    it('should remove the data from storage', () => {
      // simulate user change
      mockIdentityService.mockIdentity.next({ userId: 'user2' });

      // check if the data is removed from storage
      expect(storageService.remove).toBeCalledWith(
        checkoutDataStorageKey,
        StorageType.Session
      );
    });
  });
});
