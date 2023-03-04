import { Transformer } from '@spryker-oryx/core';
import { Provider } from '@spryker-oryx/di';
import { User } from '../../../../models';
import { DeserializedUser } from '../model';

export const UserNormalizer = 'oryx.UserNormalizer*';

export function userDataNormalizer(data: DeserializedUser): User {
  return data;
}

export const userNormalizer: Provider[] = [
  {
    provide: UserNormalizer,
    useValue: userDataNormalizer,
  },
];

declare global {
  interface InjectionTokensContractMap {
    [UserNormalizer]: Transformer<User>;
  }
}
