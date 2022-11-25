import { AccessTokenService } from '@spryker-oryx/auth';
import { resolve } from '@spryker-oryx/injector';
import { AddressService } from '@spryker-oryx/user';
import { MockAddressService, MockAddressType } from '@spryker-oryx/user/mocks';

const token = {
  accessToken: 'test',
  tokenType: 'Bearer',
};

export type BehaviorType = 'guest' | 'no-address' | 'with-address';

export const toggleBehavior = (behavior?: BehaviorType): void => {
  if (!behavior) {
    return;
  }
  const addressService = resolve(
    AddressService
  ) as unknown as MockAddressService;
  const accessTokenService = resolve(AccessTokenService);

  if (behavior === 'guest') {
    accessTokenService.remove();
  } else {
    accessTokenService.set({ token });
  }

  if (behavior === 'with-address') {
    addressService.changeMockAddressType(MockAddressType.Two);
  } else {
    addressService.changeMockAddressType(MockAddressType.Zero);
  }
};
