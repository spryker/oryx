import { BehaviorSubject, map, Observable } from 'rxjs';
import { Address } from '../../models';
import { AddressService } from '../../services';
import { mockNormalizedAddresses } from './mock-address';

export enum MockAddressType {
  Zero = 'zero',
  One = 'one',
  OneWithoutDefaults = 'one-without-defaults',
  Two = 'two',
  TwoWithoutDefaults = 'two-without-defaults',
  Three = 'three',
  ThreeWithoutDefaults = 'three-without-defaults',
}

export class MockAddressService implements Partial<AddressService> {
  protected type$ = new BehaviorSubject(MockAddressType.Two);
  protected currentAddress$ = new BehaviorSubject<Address | null>(null);

  protected setAsNoDefaults(addresses: Address[]): Address[] {
    return addresses.map((address) => ({
      ...address,
      isDefaultBilling: false,
      isDefaultShipping: false,
    }));
  }

  changeMockCurrentAddress(address: Address): void {
    this.currentAddress$.next(address);
  }

  changeMockAddressType(type: MockAddressType): void {
    this.type$.next(type);
  }

  getCurrentAddress(): Observable<Address | null> {
    return this.currentAddress$;
  }

  getAddresses(): Observable<Address[] | null> {
    return this.type$.pipe(
      map((type) => {
        switch (type) {
          case MockAddressType.One:
            return [...mockNormalizedAddresses].slice(0, 1);
          case MockAddressType.OneWithoutDefaults:
            return this.setAsNoDefaults(
              [...mockNormalizedAddresses].slice(0, 1)
            );
          case MockAddressType.Two:
            return [...mockNormalizedAddresses].slice(0, 2);
          case MockAddressType.TwoWithoutDefaults:
            return this.setAsNoDefaults(
              [...mockNormalizedAddresses].slice(0, 2)
            );
          case MockAddressType.Three:
            return [...mockNormalizedAddresses];
          case MockAddressType.ThreeWithoutDefaults:
            return this.setAsNoDefaults([...mockNormalizedAddresses]);
          case MockAddressType.Zero:
          default:
            return null;
        }
      })
    );
  }
}
