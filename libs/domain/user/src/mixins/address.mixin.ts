import { resolve, Type } from '@spryker-oryx/di';
import {
  computed,
  signal,
  Signal,
  signalProperty,
} from '@spryker-oryx/utilities';
import { LitElement } from 'lit';
import type { Address, AddressComponentProperties } from '../models';
import { AddressService } from '../services';

export declare class AddressMixinInterface
  implements AddressComponentProperties
{
  protected addressService: AddressService;
  addressId?: string;
  address?: Address;
  $address: Signal<Address | null>;
  $addresses: Signal<Address[] | null>;
}

export const AddressMixin = <
  T extends Type<LitElement & AddressComponentProperties>
>(
  superClass: T
): Type<AddressMixinInterface> & T => {
  class AddressMixinClass extends superClass {
    protected addressService = resolve(AddressService);

    @signalProperty() addressId?: string;
    @signalProperty() address?: Address;

    protected $address = computed(() => {
      if (this.address) return this.address;
      if (this.addressId) {
        return this.addressService.getAddress(this.addressId);
      }
      return null;
    });

    protected $addresses = signal(this.addressService.getAddresses());
  }

  return AddressMixinClass as unknown as Type<AddressMixinInterface> & T;
};
