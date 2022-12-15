import { resolve } from '@spryker-oryx/injector';
import { AddressService } from '@spryker-oryx/user';
import { MockAddressService, MockAddressType } from '@spryker-oryx/user/mocks';
import { LitElement } from 'lit';
import { AddressModal } from '../address-modal.model';

export type BehaviorType = 'with-address' | 'long-list';

export const toggleBehavior = (behavior?: BehaviorType): void => {
  const addressService = resolve(
    AddressService
  ) as unknown as MockAddressService;

  if (behavior === 'with-address') {
    addressService.changeMockAddressType(MockAddressType.Two);
  } else if (behavior === 'long-list') {
    addressService.changeMockAddressType(MockAddressType.LongList);
  } else {
    addressService.changeMockAddressType(MockAddressType.Zero);
  }
};

export const open = (): void =>
  (
    document.querySelector('oryx-user-address-modal') as AddressModal &
      LitElement
  )?.open();

export const asyncOpen = (): void => {
  const loop = setTimeout(() => {
    if (
      document.querySelector('oryx-user-address-modal')?.matches(':defined')
    ) {
      open();
      clearInterval(loop);
    }
  }, 100);
};
