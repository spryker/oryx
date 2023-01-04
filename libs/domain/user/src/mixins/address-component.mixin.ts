import { resolve, Type } from '@spryker-oryx/di';
import {
  ComponentMixin,
  ContentComponentProperties,
} from '@spryker-oryx/experience';
import { isDefined, observe } from '@spryker-oryx/utilities';
import { LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import {
  BehaviorSubject,
  distinctUntilChanged,
  filter,
  Observable,
  switchMap,
} from 'rxjs';
import { Address, AddressComponentProperties } from '../models';
import { AddressService } from '../services';

export declare class AddressComponentMixinInterface extends LitElement {
  protected addressId$: Observable<string>;
  protected address$: Observable<Address>;
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

    @observe()
    protected addressId$ = new BehaviorSubject(this.addressId);

    protected address$ = this.addressId$.pipe(
      distinctUntilChanged(),
      filter(isDefined),
      switchMap((addressId) => this.addressService.getAddress(addressId))
    );
  }
  return AddressComponent as unknown as Type<
    AddressComponentMixinInterface &
      ContentComponentProperties<T> &
      AddressComponentProperties
  >;
};
