import { Observable, of } from 'rxjs';
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
  protected type = MockAddressType.Two;

  protected setAsNoDefaults(addresses: Address[]): Address[] {
    return addresses.map((address) => ({
      ...address,
      isDefaultBilling: false,
      isDefaultShipping: false,
    }));
  }
  protected mockAddresses: Address[] | null = null;

  changeMockAddressType(type: MockAddressType): void {
    this.type = type;
  }

  getAddresses(): Observable<Address[] | null> {
    switch (this.type) {
      case MockAddressType.One:
        this.mockAddresses = [...mockNormalizedAddresses].slice(0, 1);
        break;
      case MockAddressType.OneWithoutDefaults:
        this.mockAddresses = this.setAsNoDefaults(
          [...mockNormalizedAddresses].slice(0, 1)
        );
        break;
      case MockAddressType.Two:
        this.mockAddresses = [...mockNormalizedAddresses].slice(0, 2);
        break;
      case MockAddressType.TwoWithoutDefaults:
        this.mockAddresses = this.setAsNoDefaults(
          [...mockNormalizedAddresses].slice(0, 2)
        );
        break;
      case MockAddressType.Three:
        this.mockAddresses = [...mockNormalizedAddresses];
        break;
      case MockAddressType.ThreeWithoutDefaults:
        this.mockAddresses = this.setAsNoDefaults([...mockNormalizedAddresses]);
        break;
      case MockAddressType.Zero:
      default:
        this.mockAddresses = null;
    }

    return of(this.mockAddresses);
  }
}
