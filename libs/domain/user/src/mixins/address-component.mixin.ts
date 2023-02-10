import { resolve, Type } from '@spryker-oryx/di';
import {
  ComponentMixin,
  ContentComponentProperties,
} from '@spryker-oryx/experience';
import { observe } from '@spryker-oryx/utilities';
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

export declare class AddressComponentMixinInterface extends LitElement {
  protected addressId$: Observable<string>;
  protected address$: Observable<Address>;
  protected addressProp$: Observable<Address>;
}

export const AddressComponentMixin = <T>(): Type<
  AddressComponentMixinInterface &
    ContentComponentProperties<T> &
    AddressComponentProperties
> => {
  class AddressComponent
    extends ComponentMixin<T>()
    implements AddressComponentProperties
  {
    protected addressService = resolve(AddressService);

    @property() addressId?: string;
    @property({ type: Object }) address?: Address;

    @observe()
    protected addressId$ = new BehaviorSubject(this.addressId);

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
  }
  return AddressComponent as unknown as Type<
    AddressComponentMixinInterface &
      ContentComponentProperties<T> &
      AddressComponentProperties
  >;
};
