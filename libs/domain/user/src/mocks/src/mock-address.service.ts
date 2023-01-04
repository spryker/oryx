import { BehaviorSubject, map, Observable, of } from 'rxjs';
import { Address } from '../../models';
import { AddressService } from '../../services';
import { mockNormalizedAddresses, uncompletedAddress } from './mock-address';

export enum MockAddressType {
  Zero = 'zero',
  One = 'one',
  OneWithoutDefaults = 'one-without-defaults',
  OneWithDefaults = 'one-with-defaults',
  Two = 'two',
  TwoWithoutDefaults = 'two-without-defaults',
  Three = 'three',
  ThreeWithDefaults = 'three-with-defaults',
  ThreeWithoutDefaults = 'three-without-defaults',
  LongList = 'long-list',
  WithUncompleted = 'with-uncompleted',
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

  protected setDefaults(addresses: Address[]): Address[] {
    return addresses.map((address, index) => ({
      ...address,
      isDefaultBilling: !index,
      isDefaultShipping: !index,
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

  getAddress(addressId: string): Observable<Address | null> {
    return this.getAddresses().pipe(
      map((addresses) => addresses?.find(({ id }) => id === addressId) ?? null)
    );
  }

  getAddresses(): Observable<Address[] | null> {
    return this.type$.pipe(
      map((type) => {
        switch (type) {
          case MockAddressType.One:
            return [...mockNormalizedAddresses].slice(0, 1);
          case MockAddressType.OneWithDefaults:
            return this.setDefaults([...mockNormalizedAddresses].slice(0, 1));
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
          case MockAddressType.ThreeWithDefaults:
            return this.setDefaults([...mockNormalizedAddresses]);
          case MockAddressType.ThreeWithoutDefaults:
            return this.setAsNoDefaults([...mockNormalizedAddresses]);
          case MockAddressType.LongList:
            return [
              ...mockNormalizedAddresses,
              ...this.setAsNoDefaults([...mockNormalizedAddresses]),
              ...this.setAsNoDefaults([...mockNormalizedAddresses]),
              ...this.setAsNoDefaults([...mockNormalizedAddresses]),
            ];
          case MockAddressType.WithUncompleted:
            return [...mockNormalizedAddresses, uncompletedAddress];
          case MockAddressType.Zero:
          default:
            return null;
        }
      })
    );
  }

  removeAddress(address: Address): Observable<Address> {
    return of(address);
  }
}
