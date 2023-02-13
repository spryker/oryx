import { resolve, Type } from '@spryker-oryx/di';
import { asyncState, observe, valueType } from '@spryker-oryx/utilities';
import { LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import {
  BehaviorSubject,
  combineLatest,
  distinctUntilChanged,
  filter,
  Observable,
  of,
  switchMap,
} from 'rxjs';
import type { Address, AddressComponentProperties } from '../models';
import { AddressService } from '../services';

export declare class AddressMixinInterface
  implements AddressComponentProperties
{
  protected addressService: AddressService;
  addressId?: string;
  protected addressId$: Observable<string>;
  address?: Address;
  protected address$: Observable<Address>;
  protected addressProp$: Observable<Address>;
  protected addressValue: Address;
}

export const AddressMixin = <
  T extends Type<LitElement & AddressComponentProperties>
>(
  superClass: T
): Type<AddressMixinInterface> & T => {
  class AddressMixinClass extends superClass {
    protected addressService = resolve(AddressService);

    @property() addressId?: string;

    @observe()
    protected addressId$ = new BehaviorSubject(this.addressId);

    @property({ type: Object }) address?: Address;

    @observe('address')
    protected addressProp$ = new BehaviorSubject(this.address);

    protected address$ = combineLatest([
      this.addressProp$,
      this.addressId$.pipe(distinctUntilChanged()),
    ]).pipe(
      filter(([address, id]) => !!address || !!id),
      switchMap(([addressProp, addressId]) =>
        addressProp
          ? of(addressProp)
          : this.addressService.getAddress(addressId!)
      )
    );

    @asyncState()
    protected addressValue = valueType(this.address$);
  }

  return AddressMixinClass as unknown as Type<AddressMixinInterface> & T;
};
