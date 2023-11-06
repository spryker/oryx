import { resolve } from '@spryker-oryx/di';
import { AddressService } from '@spryker-oryx/user';
import { MockAddressService, MockAddressType } from '@spryker-oryx/user/mocks';
import { LitElement } from 'lit';

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
    addressService.changeMockAddressType(MockAddressType.None);
  }
};

const getManageAddressElement = (): LitElement =>
  document.querySelector('oryx-checkout-manage-address') as LitElement;

export const open = (): void => {
  getManageAddressElement()
    ?.renderRoot.querySelector<HTMLElement>('oryx-button')
    ?.click();
};

export const asyncOpen = (): void => {
  const loop = setTimeout(() => {
    if (getManageAddressElement()?.matches(':defined')) {
      open();
      clearInterval(loop);
    }
  }, 100);
};
