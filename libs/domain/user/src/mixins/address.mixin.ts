import { resolve } from '@spryker-oryx/di';
import { RouterService } from '@spryker-oryx/router';
import {
  computed,
  signal,
  Signal,
  signalAware,
  signalProperty,
  Type,
} from '@spryker-oryx/utilities';
import { LitElement } from 'lit';
import { map } from 'rxjs';
import type { Address, CrudState } from '../models';
import { AddressService, AddressStateService } from '../services';

export declare class AddressMixinInterface {
  protected addressService: AddressService;
  protected addressStateService: AddressStateService;

  protected addressId: Signal<string | null>;
  protected address: Signal<Address | null>;

  /**
   * Computed address Id, provided by a property, URL parameter or state.
   */
  protected $addressId: Signal<string | null>;
  /**
   * Computed address based on the current address. The current address is either
   * dictated by the address id or the give data.
   */
  protected $address: Signal<Address | null>;
  protected $addresses: Signal<Address[] | null>;

  protected $addressState: Signal<{
    action: CrudState;
    selected: string | null;
  }>;
}

export const AddressMixin = <T extends Type<LitElement>>(
  superClass: T
): Type<AddressMixinInterface> & T => {
  @signalAware()
  class AddressMixinClass extends superClass {
    protected addressService = resolve(AddressService);
    protected addressStateService = resolve(AddressStateService);
    protected routerService = resolve(RouterService);

    @signalProperty() addressId?: string;
    @signalProperty() address?: Address;

    protected $addresses = signal(this.addressService.getList());

    protected $addressState = signal(this.addressStateService.get());

    protected $addressParamId = signal<string>(
      this.routerService
        .currentParams()
        .pipe(map((params) => params.addressId as string))
    );

    protected $addressId = computed(() => {
      return (
        this.addressId ||
        this.$addressParamId() ||
        this.$addressState().selected
      );
    });

    protected $address = computed(() => {
      if (this.address) return this.address;
      const addressId = this.$addressId();
      if (addressId) {
        return this.addressService.get(addressId);
      }
      return null;
    });
  }

  return AddressMixinClass as unknown as Type<AddressMixinInterface> & T;
};
