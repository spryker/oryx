import { IdentityService } from '@spryker-oryx/auth';
import {
  mockNormalizedPaymentMethods,
  mockNormalizedShipmentAttributes,
} from '@spryker-oryx/checkout/mocks';
import { StorageService, StorageType } from '@spryker-oryx/core';
import { createInjector, destroyInjector, Injector } from '@spryker-oryx/di';
import { BehaviorSubject, firstValueFrom, Observable, of } from 'rxjs';
import { describe } from 'vitest';
import {
  addressCheckoutStorageKey,
  contactCheckoutStorageKey,
  guestCheckoutStorageKey,
  paymentCheckoutStorageKey,
  shipmentCheckoutStorageKey,
} from '../models';
import { CheckoutDataService } from './checkout-data.service';
import { DefaultCheckoutDataService } from './default-checkout-data.service';

class MockStorageService implements Partial<StorageService> {
  get = vi.fn().mockReturnValue(of(false));
  set = vi.fn();
  remove = vi.fn();
}

class MockIdentityService implements Partial<IdentityService> {
  _identity = new BehaviorSubject<any>(undefined);
  get = () => this._identity;
}

describe('DefaultCheckoutDataService', () => {
  let service: CheckoutDataService;
  let storage: StorageService;
  let testInjector: Injector;

  beforeEach(() => {
    testInjector = createInjector({
      providers: [
        {
          provide: StorageService,
          useClass: MockStorageService,
        },
        {
          provide: IdentityService,
          useClass: MockIdentityService,
        },
        {
          provide: CheckoutDataService,
          useClass: DefaultCheckoutDataService,
        },
      ],
    });

    service = testInjector.inject(CheckoutDataService);
    storage = testInjector.inject(StorageService);
  });

  afterEach(() => {
    vi.clearAllMocks();
    destroyInjector();
  });

  it('should be provided', () => {
    expect(service).toBeInstanceOf(DefaultCheckoutDataService);
  });

  it('should get persisted data', () => {
    expect(storage.get).toHaveBeenCalledWith(
      guestCheckoutStorageKey,
      StorageType.SESSION
    );
    expect(storage.get).toHaveBeenCalledWith(
      shipmentCheckoutStorageKey,
      StorageType.SESSION
    );
    expect(storage.get).toHaveBeenCalledWith(
      paymentCheckoutStorageKey,
      StorageType.SESSION
    );
    expect(storage.get).toHaveBeenCalledWith(
      contactCheckoutStorageKey,
      StorageType.SESSION
    );
    expect(storage.get).toHaveBeenCalledWith(
      addressCheckoutStorageKey,
      StorageType.SESSION
    );
  });

  describe('isGuestCheckout', () => {
    it('should return an observable', () => {
      expect(service.isGuestCheckout()).toBeInstanceOf(Observable);
    });
  });

  describe('setIsGuestCheckout', () => {
    const cb = vi.fn();

    it('should return an observable', () => {
      expect(service.setGuestCheckout()).toBeInstanceOf(Observable);
    });

    describe('when value is set', () => {
      beforeEach(() => {
        service.setGuestCheckout(true).subscribe(cb);
      });

      it('should set the value', () => {
        expect(cb).toHaveBeenCalledWith(true);
      });

      it('should persist the value', () => {
        expect(storage.set).toHaveBeenCalled();
      });
    });

    describe('when value is removing', () => {
      beforeEach(() => {
        service.setGuestCheckout(false).subscribe(cb);
      });

      it('should remove the value', () => {
        expect(cb).toHaveBeenCalledWith(false);
      });

      it('should clear the checkout data', () => {
        expect(storage.remove).toHaveBeenCalledWith(
          guestCheckoutStorageKey,
          StorageType.SESSION
        );
      });
    });
  });

  describe('getContactDetails', () => {
    it('should return an observable', () => {
      expect(service.getCustomer()).toBeInstanceOf(Observable);
    });
  });

  describe('setContactDetails', () => {
    const details = { email: 'test' };
    const cb = vi.fn();

    describe('when value is set', () => {
      beforeEach(() => {
        service.setCustomer(details);
        service.getCustomer().subscribe(cb);
      });

      it('should set the contact details', () => {
        expect(cb).toHaveBeenCalledWith(details);
      });

      it('should store contact details in session storage', () => {
        expect(storage.set).toHaveBeenCalledWith(
          contactCheckoutStorageKey,
          details,
          StorageType.SESSION
        );
      });
    });
  });

  describe('getAddressDetails', () => {
    it('should return an observable', () => {
      expect(service.getAddress()).toBeInstanceOf(Observable);
    });
  });

  describe('setAddressDetails', () => {
    const details = {
      email: 'test',
      address1: 'test',
      address2: 'test',
      city: 'test',
      country: 'test',
      firstName: 'test',
      lastName: 'test',
      iso2Code: 'test',
      salutation: 'test',
      zipCode: 'test',
    };
    const cb = vi.fn();

    describe('when value is set', () => {
      beforeEach(() => {
        service.setAddress(details);
        service.getAddress().subscribe(cb);
      });

      it('should set the address details', () => {
        expect(cb).toHaveBeenCalledWith(details);
      });

      it('should store address details in session storage', () => {
        expect(storage.set).toHaveBeenCalledWith(
          addressCheckoutStorageKey,
          details,
          StorageType.SESSION
        );
      });
    });
  });

  describe('when getShipmentDetails is called', () => {
    it('should return an observable', () => {
      expect(service.getShipment()).toBeInstanceOf(Observable);
    });
  });

  describe('when setShipmentDetails is called', () => {
    const cb = vi.fn();

    describe('when value is set', () => {
      beforeEach(() => {
        service.setShipment(mockNormalizedShipmentAttributes);
        service.getShipment().subscribe(cb);
      });

      it('should set the shipment details', () => {
        expect(cb).toHaveBeenCalledWith(mockNormalizedShipmentAttributes);
      });

      it('should store shipment details in session storage', () => {
        expect(storage.set).toHaveBeenCalledWith(
          shipmentCheckoutStorageKey,
          mockNormalizedShipmentAttributes,
          StorageType.SESSION
        );
      });
    });
  });

  describe('when getPaymentDetails is called', () => {
    it('should return an observable', () => {
      expect(service.getPayment()).toBeInstanceOf(Observable);
    });
  });

  describe('when setPaymentDetails is called', () => {
    const cb = vi.fn();

    describe('when value is set', () => {
      beforeEach(() => {
        service.setPayment(mockNormalizedPaymentMethods[0]);
        service.getPayment().subscribe(cb);
      });

      it('should set the payment details', () => {
        expect(cb).toHaveBeenCalledWith(mockNormalizedPaymentMethods[0]);
      });

      it('should store payment details in session storage', () => {
        expect(storage.set).toHaveBeenCalledWith(
          paymentCheckoutStorageKey,
          mockNormalizedPaymentMethods[0],
          StorageType.SESSION
        );
      });
    });
  });

  describe('when identity changes', () => {
    it('should reset the state', async () => {
      const identityService = testInjector.inject(
        IdentityService
      ) as MockIdentityService;

      service.setPayment(mockNormalizedPaymentMethods[0]);
      service.setGuestCheckout();

      expect(await firstValueFrom(service.isGuestCheckout())).toBeTruthy();
      expect(await firstValueFrom(service.getPayment())).toEqual(
        mockNormalizedPaymentMethods[0]
      );

      identityService._identity.next(undefined);

      expect(await firstValueFrom(service.isGuestCheckout())).toBeFalsy();
      expect(await firstValueFrom(service.getPayment())).toEqual(null);
    });
  });
});
