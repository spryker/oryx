import { mockNormalizedShipmentAttributes } from '@spryker-oryx/checkout/mocks';
import { StorageService, StorageType } from '@spryker-oryx/core';
import { createInjector, destroyInjector } from '@spryker-oryx/injector';
import { Observable, of } from 'rxjs';
import { guestCheckoutStorageKey } from '../models';
import { CheckoutDataService } from './checkout-data.service';
import { DefaultCheckoutDataService } from './default-checkout-data.service';

class MockStorageService implements Partial<StorageService> {
  get = vi.fn().mockReturnValue(of(false));
  set = vi.fn();
  remove = vi.fn();
}

describe('DefaultCheckoutDataService', () => {
  let service: CheckoutDataService;
  let storage: StorageService;

  beforeEach(() => {
    const testInjector = createInjector({
      providers: [
        {
          provide: StorageService,
          useClass: MockStorageService,
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
  });

  describe('isGuestCheckout', () => {
    it('should return an observable', () => {
      expect(service.isGuestCheckout()).toBeInstanceOf(Observable);
    });
  });

  describe('setIsGuestCheckout', () => {
    const cb = vi.fn();

    it('should return an observable', () => {
      expect(service.setIsGuestCheckout()).toBeInstanceOf(Observable);
    });

    describe('when value is set', () => {
      beforeEach(() => {
        service.setIsGuestCheckout(true).subscribe(cb);
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
        service.setIsGuestCheckout(false).subscribe(cb);
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
      expect(service.getContactDetails()).toBeInstanceOf(Observable);
    });
  });

  describe('setContactDetails', () => {
    const details = { email: 'test' };
    const cb = vi.fn();

    describe('when value is set', () => {
      beforeEach(() => {
        service.setContactDetails(details);
        service.getContactDetails().subscribe(cb);
      });

      it('should set the contact details', () => {
        expect(cb).toHaveBeenCalledWith(details);
      });
    });
  });

  describe('getAddressDetails', () => {
    it('should return an observable', () => {
      expect(service.getAddressDetails()).toBeInstanceOf(Observable);
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
        service.setAddressDetails(details);
        service.getAddressDetails().subscribe(cb);
      });

      it('should set the address details', () => {
        expect(cb).toHaveBeenCalledWith(details);
      });
    });
  });

  describe('when getShipmentDetails is called', () => {
    it('should return an observable', () => {
      expect(service.getShipmentDetails()).toBeInstanceOf(Observable);
    });
  });

  describe('when setShipmentDetails is called', () => {
    const cb = vi.fn();

    describe('when value is set', () => {
      beforeEach(() => {
        service.setShipmentDetails(mockNormalizedShipmentAttributes);
        service.getShipmentDetails().subscribe(cb);
      });

      it('should set the shipment details', () => {
        expect(cb).toHaveBeenCalledWith(mockNormalizedShipmentAttributes);
      });
    });
  });
});
