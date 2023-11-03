import { MockAuthService } from '@spryker-oryx/auth/mocks';
import { resolve } from '@spryker-oryx/di';
import { AddressService } from '@spryker-oryx/user';
import { MockAddressService, MockAddressType } from '@spryker-oryx/user/mocks';

export type BehaviorType = 'guest' | 'no-address' | 'with-address';

export const toggleBehavior = (behavior?: BehaviorType): void => {
  if (!behavior) return;

  const addressService = resolve(
    AddressService
  ) as unknown as MockAddressService;
  const authService = resolve(MockAuthService);

  if (behavior === 'guest') authService.setAuthenticated(false);
  else authService.setAuthenticated(true);

  if (behavior === 'with-address')
    addressService.changeMockAddressType(MockAddressType.Two);
  else addressService.changeMockAddressType(MockAddressType.None);
};
