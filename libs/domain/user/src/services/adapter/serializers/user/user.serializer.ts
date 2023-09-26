import { Serializer } from '@spryker-oryx/core';
import { Provider } from '@spryker-oryx/di';
import { ApiUserModel, User } from '../../../../models';

export const UserSerializer = 'oryx.UserSerializer*';

export function userAttributesSerializer(
  attributes: User
): Partial<ApiUserModel.Payload> {
  return {
    type: 'customers',
    attributes,
  };
}

export const userSerializers: Provider[] = [
  {
    provide: UserSerializer,
    useValue: userAttributesSerializer,
  },
];

declare global {
  interface InjectionTokensContractMap {
    [UserSerializer]: Serializer<User>[];
  }
}
